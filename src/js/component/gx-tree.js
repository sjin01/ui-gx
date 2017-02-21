/**
 * Created by sjin on 17/2/21.
 */
define(['jquery'], function ($) {
  $.fn['tree'] = function (options) {
    new initTree(options, $(this));
  };

  var initTree = function (options, $this) {
    // console.log('init gx tree');
    // console.log(options.data);
    // console.log($this);

    var option = {
      activeClassName: 'active',
      dataKey: 'obj',
      pathAttrName: options.pathAttrName || 'path',
      nameAttrName: options.nameAttrName || 'name',
      subListAttrName: options.subListAttrName || 'items',
    };

    var $main, nodeList = [], node$List = [];

    var TEMPLATE = {
      main: '<ul class="gx-tree"></ul>',
      subMain: '<ul class="gx-sub-tree"></ul>'
    };

    /**
     * 递归 构建 html 结构
     */
    var construct = function (list, $target) {
      for (var i = 0; i < list.length; i++) {
        var item = list[i]; // 暂存对象
        // 对象对应的 一项 html dom 节点
        $target.append('<li><a href="' + item[option.pathAttrName] + '"><span class="tree-text">' + item[option.nameAttrName] + '</span></a></li>');
        // jquery 方式获取当前节点
        var $curObj = $target.find('li:last');
        // item 数据存到当前节点 data 下
        $curObj.data(option.dataKey, item);

        // 对象和相应的 dom jquery对象,存 数组
        var index = nodeList.length;
        nodeList[index] = item;
        node$List[index] = $curObj;

        // 如果有子数据, 递归
        if (item[option.subListAttrName] && item[option.subListAttrName].length > 0) {
          $curObj.append(TEMPLATE.subMain);
          construct(item[option.subListAttrName], $curObj.find('.gx-sub-tree'));
        }
      }
    };

    var init = function (treeData) {
      $this.append(TEMPLATE.main);
      $main = $this.find('.gx-tree');
      construct(treeData, $main);
      // console.log(nodeList);
      // console.log(node$List);

      // 展示第一个
      node$List[0].addClass(option.activeClassName);

      // 绑定事件
      $('.gx-tree a').on('click.gxTree', function () {
        var $pa = $(this).parent();
        var obj = $pa.data(option.dataKey);

        if (obj[option.subListAttrName] && obj[option.subListAttrName].length > 0) {
          if ($pa.hasClass(option.activeClassName)) {
            $pa.removeClass(option.activeClassName).find('li').removeClass(option.activeClassName);
          } else {
            $pa.addClass(option.activeClassName);
          }
          if (options.onNodeClick && options.allClickCallBack) options.onNodeClick(obj);
          return false;
        }
        if (options.onNodeClick) {
          options.onNodeClick(obj);
          return false;
        }
        // console.log('to path..');
      });
    };

    if (options.data) {
      init(options.data);
    } else if (options.dataUrl) {
      $.ajax({
        url: options.dataUrl,
        data: null,
        type: 'GET',
        dataType: 'JSON',
        success: function (result) {
          if (result) {
            init(result);
          }
        }
      });
    }

  };

});