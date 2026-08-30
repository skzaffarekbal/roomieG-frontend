import MoonIcon from '../assets/icon/MoonIcon';
import SunIcon from '../assets/icon/SunIcon';
import { useTheme } from '../context/ThemeContext';
import { THEMES } from '../utils/constant';

function SettingsModal() {
  const { theme, setTheme, isDark, toggleTheme, isSettingsOpen, closeSettings } = useTheme();

  if (!isSettingsOpen) return null;

  return (
    <div className='modal modal-open z-50'>
      <div className='modal-box max-w-lg bg-base-100 border border-base-300 shadow-2xl'>
        <div className='flex items-center justify-between border-b border-base-300 pb-3'>
          <div className='flex items-center gap-2'>
            <span className='text-2xl'>⚙️</span>
            <div>
              <h3 className='font-bold text-lg text-base-content'>App Settings</h3>
              <p className='text-xs opacity-70 text-base-content'>
                Customize your theme and appearance
              </p>
            </div>
          </div>
          <button
            onClick={closeSettings}
            className='btn btn-sm btn-circle btn-ghost text-base-content'
            aria-label='Close modal'
          >
            ✕
          </button>
        </div>

        <div className='py-4 space-y-6'>
          {/* Quick Mode Toggle */}
          <div className='flex items-center justify-between p-3 rounded-xl bg-base-300'>
            <div>
              <div className='font-semibold text-sm text-base-content'>Dark / Light Mode</div>
              <div className='text-xs opacity-70 text-base-content'>
                Currently using <span className='font-medium capitalize text-primary'>{theme}</span>{' '}
                mode
              </div>
            </div>
            <label className='swap swap-rotate btn btn-sm btn-circle btn-ghost'>
              <input type='checkbox' checked={isDark} onChange={toggleTheme} />
              <SunIcon className='swap-off h-5 w-5 fill-current text-amber-500' />
              <MoonIcon className='swap-on h-5 w-5 fill-current text-sky-400' />
            </label>
          </div>

          {/* Theme Palette Grid */}
          <div>
            <div className='font-semibold text-sm text-base-content mb-2 flex items-center justify-between'>
              <span>Theme Palettes</span>
              <span className='badge badge-sm badge-neutral capitalize'>{theme}</span>
            </div>
            <div className='grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1'>
              {THEMES.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`btn btn-sm h-auto py-2 flex flex-col items-center justify-between rounded-xl border text-xs capitalize transition-all ${
                      isSelected
                        ? 'btn-primary shadow-md ring-2 ring-primary ring-offset-2 ring-offset-base-100 font-bold'
                        : 'bg-base-200 border-base-300 hover:border-primary/50 text-base-content'
                    }`}
                  >
                    <div className='flex items-center gap-1.5 w-full justify-between'>
                      <span>{t.name}</span>
                      <span
                        className='w-3 h-3 rounded-full border border-base-content/20 shadow-xs'
                        style={{ backgroundColor: t.color }}
                      />
                    </div>
                    <span className='text-[10px] opacity-60 w-full text-left'>
                      {t.type === 'dark' ? '🌙 Dark' : '☀️ Light'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className='modal-action border-t border-base-300 pt-3'>
          <button onClick={closeSettings} className='btn btn-primary btn-sm px-5'>
            Done
          </button>
        </div>
      </div>
      <div className='modal-backdrop bg-black/40' onClick={closeSettings}></div>
    </div>
  );
}

export default SettingsModal;
