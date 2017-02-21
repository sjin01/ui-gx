/**
 * requireJS 公用库配置
 */
requirejs.config({
  urlArgs: "v=1.0.0",
  paths: {
    'jquery': 'lib/jquery/jquery-1.11.1',
    'ractive': 'lib/ractive/ractive-legacy',
    'text': 'lib/text',
    'ui': 'component/ui',
    'tree': 'component/tree',
    'jquery-pagination': 'lib/jquery/jquery.pagination',
    'pagination': 'component/pagination',
    'spinner': 'component/spinner',
    'popup': 'component/popup',
    'ractive-slide': 'lib/ractive/ractive-transitions-slide.min',
    'autoComplete': 'component/autoComplete',
    'validate': 'lib/jquery/validate/jquery.validate',
    'validate.zh': 'lib/jquery/validate/messages_zh',
    'validate.additional': 'lib/jquery/validate/additional-methods',
    'moment': 'lib/moment/moment',
    'numeral': 'lib/numeral/numeral',
    'tinymce': 'lib/tinymce/tinymce.min',
    'pikaday.jquery': 'lib/pikaday/pikaday.jquery',
    'lightbox': 'lib/lightbox/js/lightbox',
    'jquery-fileupload': 'lib/jquery/fileupload/jquery.fileupload-validate',
    'jquery-iframe-transport': 'lib/jquery/fileupload/jquery.iframe-transport',
    'baseCommon': 'lib/baseCommon',
    'dictionary': 'component/dictionary',
    'slick': 'lib/slick/slick',
    'respond': 'lib/respond/respond.min',
    'jquery-fly': 'lib/jquery/jquery.fly',
    'window': 'component/window',
    'multiSelect': 'component/multiSelect',
    'cssMin': 'lib/css.min',
    'placeholder': 'component/placeholder',
    'slidesjs': 'lib/jquery/slides/jquery.slides',
    'is': 'component/is',
    'panel': 'component/panel',
    'pairdate': 'component/pairdate',
    'grant': 'component/grant',
    'htmleditor': 'component/htmleditor',
    'switcher': 'component/switcher',
    'iCheck': 'component/iCheck',
    'iSelect': 'component/iSelect',
    'tooltip': 'component/tooltip',
    'roll': 'component/roll',
    'choice-ganged': 'component/choice-ganged',

    'star-rating': 'lib/star-rating/star-rating',
    'star-rating-fa': 'lib/star-rating/krajee-fa/theme',

    'gx-tree': 'component/gx-tree'
  },
  map: {
    '*': {
      'css': 'cssMin' // or whatever the path to require-css is
    }
  },
  shim: {
    'jquery-iframe-transport': {deps: ['jquery']},
    'tinymce': {
      deps: ['jquery', 'jquery-iframe-transport'],
      "exports": 'tinymce'
    },
    'jquery-pagination': {deps: ['jquery']},
    'jquery-fly': {deps: ['jquery']},
    'slidesjs': {deps: ['jquery']},

    'star-rating-fa': {
      deps: ['jquery', 'star-rating']
    }
  }
});
define("base", [
  'jquery',
  'ractive',
  'text',
  'ui',
  'tree',
  'jquery-pagination',
  'pagination',
  'popup',
  'ractive-slide',
  'autoComplete',
  'validate',
  'validate.zh',
  'validate.additional',
  'moment',
  'numeral',
  'spinner',
  'pikaday.jquery',
  'lightbox',
  'jquery-fileupload',
  'baseCommon',
  'tinymce',
  'jquery-iframe-transport',
  'slick',
  'respond',
  'jquery-fly',
  'window',
  'multiSelect',
  'cssMin',
  'placeholder',
  'slidesjs',
  'is',
  'panel',
  'pairdate',
  'grant',
  'switcher',
  'htmleditor',
  'iCheck',
  'iSelect',
  'tooltip',
  'panel'
], function () {
});
