import ApiRl from './ApiRl'

export default {
  uploadSvgLayout(file) {
    const formData = new FormData();
    formData.append('file', file);
    return ApiRl().post('svg-layout', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getSvgLayouts() {
    return ApiRl().get('svg-layouts');
  },

  getSvgLayout(filename) {
    return ApiRl().get(`svg-layout/${filename}`);
  },

  getSvgLayoutAsText(filename) {
    return ApiRl().get(`svg-layout/${filename}`, {
      responseType: 'text'
    });
  },

  deleteSvgLayout(filename) {
    return ApiRl().delete(`svg-layout/${filename}`);
  }
};
