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
export const formatLifestyleValue = (val, key = null) => {
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
    never:
      'Never' +
      ' ' +
      (key === 'smoking' ? '🚭' : key === 'drinking' ? '🍻' : key === 'guests' ? '👥' : ''),
    occasionally:
      'Occasionally' +
      ' ' +
      (key === 'smoking'
        ? '🚬'
        : key === 'drinking'
          ? '🍻'
          : key === 'guests'
            ? '👥'
            : key === 'music'
              ? '🎶'
              : ''),
    regularly: 'Regularly' + ' ' + (key === 'smoking' ? '🚬' : key === 'drinking' ? '🍻' : ''),
    frequently: 'Frequently' + ' ' + (key === 'guests' ? '👥' : key === 'music' ? '🎶' : ''),
    quiet: 'Quiet 🎧',
    early_bird: 'Early Bird 🛌 (10 - 5)',
    normal: 'Normal 🛌 (12 - 7)',
    night_owl: 'Night Owl 🛌 (2 - 10)',
    vegetarian: 'Vegetarian 🥗',
    non_vegetarian: 'Non-Vegetarian 🥩',
    eggetarian: 'Eggetarian 🥚',
    vegan: 'Vegan 🥬',
    flexible: 'Flexible 🍱',
    office: 'WFO 🏢',
    hybrid: 'Hybrid 💻',
    remote: 'WFH 🏡',
    student: 'Student 👨‍🎓',
  };

  return map[val] || String(val);
};
