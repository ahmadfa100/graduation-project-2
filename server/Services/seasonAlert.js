export function checkSeasonAlerts() {
  const seasons = [
    { crop: 'cucumber',          start: 2,  end: 9 },
    { crop: 'zucchini',          start: 2,  end: 8 },
    { crop: 'armenian cucumber', start: 2,  end: 5 },
    { crop: 'snake melon',       start: 2,  end: 5 },
    { crop: 'tomato',            start: 3,  end: 7 },
    { crop: 'pepper',            start: 3,  end: 6 },
    { crop: 'eggplant',          start: 3,  end: 6 },
    { crop: 'watermelon',        start: 3,  end: 6 },
    { crop: 'melon',             start: 3,  end: 6 },
    { crop: 'corn',              start: 3,  end: 7 },
    { crop: 'lettuce',           start: 9,  end: 4 }, // wraps year end
    { crop: 'cabbage',           start: 9,  end: 3 },
    { crop: 'carrot',            start: 9,  end: 3 },
    { crop: 'onion',             start: 9,  end: 3 },
    { crop: 'garlic',            start:10,  end: 2 },
    { crop: 'potato',            start: 2,  end: 4 },
    { crop: 'spinach',           start: 9,  end: 3 },
    { crop: 'broccoli',          start: 9,  end: 2 },
    { crop: 'peas',              start: 9,  end: 2 },
    { crop: 'beans',             start: 3,  end: 7 },
  ];

  const month = new Date().getMonth() + 1;

  return seasons.filter(({ start, end }) =>
    start <= end
      ? month >= start && month <= end        // normal range
      : month >= start || month <= end        // wrap‑around
  );
}