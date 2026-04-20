const T = {
  he: {
    title:              'סולמות וחבלים',
    subtitle:           'משחק ניחוש החיות 🐾',
    desc:               'הטל קוביות, עלה בסולמות, היזהר מהחבלים!',
    'mode.local':       '🏠 מקומי',
    'mode.online':      '🌐 אונליין',
    'players.label':    'מספר שחקנים:',
    'btn.start':        '🎲 התחל משחק!',
    'online.name':      '🎮 השם שלך',
    'online.create':    '➕ צור חדר חדש',
    'online.divider':   '— או —',
    'online.code':      'קוד חדר (6 תווים)',
    'online.join':      '🚪 הצטרף',
    'lobby.title':      '🎮 לובי',
    'lobby.code.lbl':   'קוד החדר:',
    'lobby.hint':       'שתף את הקוד עם חברים כדי שיצטרפו!',
    'lobby.start':      '🎲 התחל משחק! (מינימום 2)',
    'game.title':       '🐍 סולמות וחבלים 🪜',
    'legend.title':     'מפתח:',
    'legend.ladder':    '🪜 סולם – עולים!',
    'legend.snake':     '🐍 חבל – יורדים...',
    'legend.q':         '❓ שאלה',
    'legend.right':     '✅ נכון = +3',
    'legend.wrong':     '❌ שגוי = -2',
    'btn.roll':         '🎲 הטל קוביות',
    'win.title':        '🏆 מנצח/ת!',
    'win.sub':          'הגיע/ה ראשון/ה לתא 100!',
    'btn.again':        '🔄 שחק שוב',
    'trivia.h2':        '❓ שאלת חיות',
    'footer':           '© כל הזכויות שמורות ל-yizik',
    // dynamic
    'trivia.q':    (l) => `איזו חיה מתחילה באות "${l}"?`,
    'trivia.ok':   (n) => `✅ נכון! ${n} מתקדם/ת 3 תאים!`,
    'trivia.fail': (a, n) => `❌ טעות! הנכון: ${a}. ${n} חוזר/ת 2 תאים.`,
    'trivia.fail.online': (a) => `❌ טעות! הנכון: ${a}`,
    'roll.wait':   (n) => `⏳ תור: ${n}`,
    'rooms.empty': 'אין חדרים פתוחים כרגע',
    'err.code':    'הכנס קוד חדר בן 6 תווים',
    'err.notfound':'חדר לא נמצא',
    'err.started': 'המשחק כבר התחיל',
    'err.full':    'החדר מלא',
  },
  en: {
    title:              'Snakes & Ladders',
    subtitle:           'Animal Guessing Game 🐾',
    desc:               'Roll dice, climb ladders, avoid snakes!',
    'mode.local':       '🏠 Local',
    'mode.online':      '🌐 Online',
    'players.label':    'Players:',
    'btn.start':        '🎲 Start Game!',
    'online.name':      '🎮 Your name',
    'online.create':    '➕ Create New Room',
    'online.divider':   '— or —',
    'online.code':      'Room code (6 chars)',
    'online.join':      '🚪 Join',
    'lobby.title':      '🎮 Lobby',
    'lobby.code.lbl':   'Room Code:',
    'lobby.hint':       'Share the code with friends to join!',
    'lobby.start':      '🎲 Start Game! (min. 2 players)',
    'game.title':       '🐍 Snakes & Ladders 🪜',
    'legend.title':     'Key:',
    'legend.ladder':    '🪜 Ladder – go up!',
    'legend.snake':     '🐍 Snake – go down...',
    'legend.q':         '❓ Question',
    'legend.right':     '✅ Right = +3',
    'legend.wrong':     '❌ Wrong = -2',
    'btn.roll':         '🎲 Roll Dice',
    'win.title':        '🏆 Winner!',
    'win.sub':          'Reached square 100 first!',
    'btn.again':        '🔄 Play Again',
    'trivia.h2':        '❓ Animal Quiz',
    'footer':           '© All rights reserved to yizik',
    // dynamic
    'trivia.q':    (l) => `Which animal starts with "${l}"?`,
    'trivia.ok':   (n) => `✅ Correct! ${n} moves forward 3 squares!`,
    'trivia.fail': (a, n) => `❌ Wrong! Correct: ${a}. ${n} goes back 2 squares.`,
    'trivia.fail.online': (a) => `❌ Wrong! Correct: ${a}`,
    'roll.wait':   (n) => `⏳ ${n}'s turn`,
    'rooms.empty': 'No open rooms right now',
    'err.code':    'Enter a 6-character room code',
    'err.notfound':'Room not found',
    'err.started': 'Game already started',
    'err.full':    'Room is full',
  },
};

export let lang = 'he';

export function t(key, ...args) {
  const val = T[lang]?.[key] ?? T.he[key] ?? key;
  return typeof val === 'function' ? val(...args) : val;
}

export function setLang(l) {
  lang = l;
  const isHe = l === 'he';
  document.documentElement.lang = l;
  document.documentElement.dir = isHe ? 'rtl' : 'ltr';
  document.documentElement.classList.toggle('lang-en', !isHe);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = t(el.dataset.i18n);
    if (v) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const v = t(el.dataset.i18nPh);
    if (v) el.placeholder = v;
  });

  const btn = document.getElementById('lang-btn');
  if (btn) btn.textContent = isHe ? 'EN' : 'עב';
}
