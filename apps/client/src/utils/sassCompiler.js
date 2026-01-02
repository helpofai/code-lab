import Sass from 'sass.js/dist/sass.sync.js';

export const compileScss = (scss) => {
  return new Promise((resolve, reject) => {
    try {
      Sass.compile(scss, (result) => {
        if (result.status === 0) {
          resolve(result.text);
        } else {
          console.warn('Sass compilation error:', result.message);
          resolve(scss); // Fallback to raw CSS on error
        }
      });
    } catch (e) {
      console.error('Sass crash:', e);
      resolve(scss);
    }
  });
};
