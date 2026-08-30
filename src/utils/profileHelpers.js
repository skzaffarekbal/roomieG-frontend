export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
};

export const formatLanguages = (languages) => {
  if (!languages) return [];
  if (Array.isArray(languages)) return languages;
  if (typeof languages === 'string') {
    return languages
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);
  }
  return [];
};

/**
 * Safely format lifestyle field values whether they are strings, booleans, or nested objects like { hasPets, petFriendly }
 */
export const formatLifestyleValue = (val) => {
  if (val === null || val === undefined || val === '') return '';
  if (typeof val === 'number') return `${val}/5`;
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (typeof val === 'object') {
    if ('hasPets' in val || 'petFriendly' in val) {
      if (val.hasPets) return 'Have Pets 🐾';
      if (val.petFriendly) return 'Pet Friendly 🐶';
      if (val.petFriendly === false && val.hasPets === false) return 'No Pets 🚫';
      return 'Pet Friendly 🐶';
    }
    const parts = Object.entries(val)
      .filter(([, v]) => Boolean(v))
      .map(([k, v]) => (typeof v === 'boolean' ? k : `${k}: ${v}`));
    return parts.join(', ');
  }

  const map = {
    never: 'Never',
    occasionally: 'Occasionally',
    regularly: 'Regularly',
    frequently: 'Frequently',
    quiet: 'Quiet',
    early_bird: 'Early Bird (10 PM - 5 AM)',
    normal: 'Normal (12 PM - 7 AM)',
    night_owl: 'Night Owl (2 AM - 10 AM)',
    vegetarian: 'Vegetarian',
    non_vegetarian: 'Non-Vegetarian',
    eggetarian: 'Eggetarian',
    vegan: 'Vegan',
    flexible: 'Flexible',
    office: 'Work From Office',
    hybrid: 'Hybrid',
    remote: 'Work From Home',
    student: 'Student',
  };

  return map[val] || String(val);
};
