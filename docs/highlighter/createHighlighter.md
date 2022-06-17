# createHighlighter


	createHighlighter(className?: string = 'highlight', options?: {})

## 参数
- className

	带有className的元素被添加到dom中产生突出显示


- options

|       name       |     type    |    default    | Description                                                       |
|:----------------:|:-----------:|:-------------:|-------------------------------------------------------------------|
|      tagName     |    string   |      span     | 默认使用span ，也可以是其他内联元素                               |
|      elAttrs     |    Object   |       {}      | 指定元素的特性                                                    |
|      elProps     |    Object   |       {}      | 指定元素的属性                                                    |
| containerElement | HTMLElement | document.body | 保证containerElement以外的dom节点发生变化，不会对突出显示造成影响 |

## 返回值
- [Highlighter](https://github.com/Aery3c/highlighter/blob/main/docs/highlighter/highlighter.md)

## 用法

```javascript
import { createHighlighter } from 'highlighter';

function handleClick () {
  // 点击删除突出显示
  pink.removeHighlights([pink.getHighlightFromElement(this)]);
}

// 创建一支粉色的笔
const pink = createHighlighter('pink', {
  elProps: {
    onclick: handleClick 
  }
});

```
