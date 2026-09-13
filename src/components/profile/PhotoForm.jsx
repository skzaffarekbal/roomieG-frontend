import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addUser } from '../../redux/userSlice';
import { updatePhotoApi, getPresignedUrlApi } from '../../api/profileApi';

const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg'];
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const DEFAULT_PHOTO =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

/**
 * Generate a blurred version of an image file on the client using Canvas.
 */
const generateBlurredBlob = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Limit dimensions for fast processing and optimal blur
        const maxDim = 600;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Apply canvas blur
        if ('filter' in ctx) {
          const blurRadius = 10;
          ctx.filter = `blur(${blurRadius}px)`;
          // Shift and scale slightly to crop out the transparent/white edge artifacts
          ctx.drawImage(
            img,
            -blurRadius,
            -blurRadius,
            width + blurRadius * 2,
            height + blurRadius * 2,
          );
        } else {
          ctx.drawImage(img, 0, 0, width, height);
        }

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blur image blob'));
            }
          },
          mimeType,
          0.85,
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to read image for blur generation'));
    };

    img.src = objectUrl;
  });
};

function PhotoForm({ user, onUpdateLivePreview }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const exactPhoto = user?.photo?.exactPhoto || user?.photoUrl || DEFAULT_PHOTO;
  const blurPhoto = user?.photo?.blurPhoto || exactPhoto;

  const [showBlurPreview, setShowBlurPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Clean up object preview url when component unmounts or changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (file) => {
    if (!file) return 'Please select an image file.';

    const ext = file.name.split('.').pop()?.toLowerCase();
    const isValidExt = ext && ALLOWED_EXTENSIONS.includes(ext);
    const isValidMime = file.type && ALLOWED_MIME_TYPES.includes(file.type);

    if (!isValidExt || !isValidMime) {
      return 'Invalid file type. Only .png, .jpeg, and .jpg formats are allowed.';
    }

    // 10MB maximum file size
    if (file.size > 10 * 1024 * 1024) {
      return 'Image file size must be less than 10MB.';
    }

    return null;
  };

  const handleFileChange = (file) => {
    setError('');
    setSuccess(false);

    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!loading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (loading) return;

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    if (e) e.preventDefault();
    if (!selectedFile) {
      setError('Please select a photo to upload.');
      return;
    }

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // 1. Generate blur version on client
      setLoadingStep('Generating privacy blur photo...');
      const blurBlob = await generateBlurredBlob(selectedFile);

      // 2. Request presigned URLs from backend
      setLoadingStep('Requesting secure S3 upload credentials...');
      const presignedRes = await getPresignedUrlApi({
        mimeType: selectedFile?.type?.split('/')[1],
      });

      const data = presignedRes?.data || presignedRes;
      const { uploadUrl, uploadBlurUrl, finalFileName, finalBlurFileName } = data || {};

      if (!uploadUrl || !uploadBlurUrl || !finalFileName || !finalBlurFileName) {
        throw new Error('Invalid presigned URL response from server.');
      }

      // 3. Upload both original and blurred images directly to AWS S3 bucket
      setLoadingStep('Uploading photos to AWS bucket...');
      await Promise.all([
        axios.put(uploadUrl, selectedFile, {
          headers: {
            'Content-Type': selectedFile.type || 'image/jpeg',
          },
        }),
        axios.put(uploadBlurUrl, blurBlob, {
          headers: {
            'Content-Type': blurBlob.type || selectedFile.type || 'image/jpeg',
          },
        }),
      ]);

      // 4. Update profile with the uploaded photo keys / URLs
      setLoadingStep('Saving photo to your profile...');
      const payload = {
        exactPhoto: finalFileName,
        blurPhoto: finalBlurFileName,
      };

      const res = await updatePhotoApi(payload);

      const photoObj = res?.data?.photo || res?.data;
      const rawExact = photoObj?.exactPhoto;
      const rawBlur = photoObj?.blurPhoto;

      // Add a timestamp query param to bust browser image caching for S3
      const timestamp = Date.now();
      const newExactPhoto = rawExact
        ? `${rawExact.split('?')[0]}?t=${timestamp}`
        : user?.photo?.exactPhoto;
      const newBlurPhoto = rawBlur
        ? `${rawBlur.split('?')[0]}?t=${timestamp}`
        : user?.photo?.blurPhoto;

      const newPhotoData = {
        exactPhoto: newExactPhoto,
        blurPhoto: newBlurPhoto,
      };

      if (rawExact) {
        const updatedUser = {
          ...user,
          photo: newPhotoData,
        };
        dispatch(addUser(updatedUser));
      }

      // Update live preview in parent
      if (onUpdateLivePreview) {
        onUpdateLivePreview({
          photo: newPhotoData,
        });
      }

      // Reset selection
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('Photo upload error:', err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Failed to upload photo. Please try again.',
      );
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError('');
  };

  const activeDisplayPhoto = previewUrl || (showBlurPreview ? blurPhoto : exactPhoto);

  return (
    <div className='space-y-6 text-base-content'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-base-300 pb-3'>
        <div>
          <h3 className='font-bold text-lg flex items-center gap-2'>
            <span>📷</span> Profile Photo
          </h3>
          <p className='text-xs opacity-70'>
            Upload a clear profile photo. RoomieG automatically generates a secure blur version for
            privacy.
          </p>
        </div>
        {success && (
          <span className='badge badge-success text-white badge-sm font-semibold animate-pulse'>
            Photo Updated ✓
          </span>
        )}
      </div>

      {/* Main Container */}
      <div className='flex flex-col md:flex-row items-center md:items-start gap-6 p-5 rounded-2xl bg-base-200/50 border border-base-300'>
        {/* Photo Avatar & Preview */}
        <div className='flex flex-col items-center gap-2.5 shrink-0'>
          <div className='avatar relative'>
            <div className='w-32 h-32 rounded-2xl ring-4 ring-primary/40 ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300 shadow-xl relative'>
              <img
                src={activeDisplayPhoto}
                alt='Profile preview'
                className='w-full h-full object-cover transition-all duration-300'
              />
              {loading && (
                <div className='absolute inset-0 bg-base-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 p-2 text-center'>
                  <span className='loading loading-spinner loading-md text-primary'></span>
                  <span className='text-[10px] font-semibold leading-tight'>Uploading...</span>
                </div>
              )}
            </div>
          </div>

          {/* Toggle Blur Preview (when not selecting a new file) */}
          {!previewUrl && blurPhoto && blurPhoto !== exactPhoto && (
            <button
              type='button'
              disabled={loading}
              onClick={() => setShowBlurPreview((prev) => !prev)}
              className='btn btn-ghost btn-xs text-[11px] font-medium opacity-80 hover:opacity-100'
            >
              {showBlurPreview ? '👁️ Show Normal View' : '🔒 Preview Blurred View'}
            </button>
          )}

          {previewUrl && (
            <span className='badge badge-info badge-outline badge-xs font-semibold'>
              Ready to Upload
            </span>
          )}
        </div>

        {/* Dropzone & File Uploader */}
        <div className='flex-1 space-y-4 w-full'>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !loading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? 'border-primary bg-primary/10 scale-[1.01]'
                : 'border-base-300 hover:border-primary/60 bg-base-100 hover:bg-base-200/60'
            } ${loading ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
          >
            <input
              ref={fileInputRef}
              type='file'
              accept='.png,.jpg,.jpeg,image/png,image/jpeg,image/jpg'
              onChange={(e) => handleFileChange(e.target.files?.[0])}
              className='hidden'
              disabled={loading}
            />

            <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl'>
              {loading ? <span className='loading loading-spinner loading-sm'></span> : '☁️'}
            </div>

            <div>
              <p className='text-xs sm:text-sm font-bold text-base-content'>
                {selectedFile ? (
                  <span className='text-primary font-semibold'>{selectedFile.name}</span>
                ) : (
                  <>
                    <span className='text-primary hover:underline'>Click to upload</span> or drag
                    and drop
                  </>
                )}
              </p>
              <p className='text-[11px] opacity-60 mt-0.5'>
                Supported formats: <span className='font-semibold'>.PNG, .JPG, .JPEG</span> (Max
                10MB)
              </p>
            </div>
          </div>

          {/* Loading Progress State Indicator */}
          {loading && (
            <div className='p-3.5 bg-primary/10 border border-primary/20 rounded-xl space-y-2 animate-pulse'>
              <div className='flex items-center justify-between text-xs font-semibold text-primary'>
                <span className='flex items-center gap-2'>
                  <span className='loading loading-spinner loading-xs'></span>
                  {loadingStep || 'Processing upload...'}
                </span>
                <span className='text-[11px] uppercase tracking-wider font-bold'>In Progress</span>
              </div>
              <progress className='progress progress-primary w-full h-1.5'></progress>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className='alert alert-error text-white text-xs rounded-xl p-3 shadow-xs flex items-center gap-2'>
              <span>⚠️</span>
              <span className='flex-1'>{error}</span>
              <button
                type='button'
                onClick={() => setError('')}
                className='btn btn-ghost btn-xs text-white p-0 h-auto min-h-0'
              >
                ✕
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex items-center justify-end gap-3 pt-2'>
            {selectedFile && (
              <button
                type='button'
                onClick={handleCancelSelection}
                disabled={loading}
                className='btn btn-ghost btn-sm rounded-xl text-xs font-semibold'
              >
                Cancel
              </button>
            )}

            <button
              type='button'
              onClick={() => {
                if (!selectedFile) {
                  fileInputRef.current?.click();
                } else {
                  handleUpload();
                }
              }}
              disabled={loading}
              className='btn btn-primary btn-sm rounded-xl font-bold px-6 shadow-md shadow-primary/20 flex items-center gap-2'
            >
              {loading ? (
                <>
                  <span className='loading loading-spinner loading-xs'></span>
                  <span>Uploading...</span>
                </>
              ) : selectedFile ? (
                <>
                  <span>Upload & Save</span>
                  <span>↗</span>
                </>
              ) : (
                'Choose Photo'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoForm;
