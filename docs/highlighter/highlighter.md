# Highlighter

**Highlighter** 表示一支笔，你可以用这支笔在纸上涂抹，它通常使用[createHighlighter](https://github.com/Aery3c/highlighter/blob/main/docs/highlighter/createHighlighter.md)创建


### 属性

- Highlighter.highlights

	返回一个`Array`，内部包含所有通过`Highlighter`创建的 [Highlight]() 对象

- Highlighter.containerElement  

	返回一个`HTMLElement`，表示`Highlighter`可进行作业的区域


### 方法

- [Highlighter.highlightSelection(selection?: Selection)](https://github.com/Aery3c/highlighter/blob/main/docs/highlighter/highlightSelection.md)  

	突出显示selection

- [Highlighter.unhighlightSelection(selection?: Selection)]()

	从selection撤销突出显示

- [Highlighter.addHighlight(highlight: Highlight)]()  

	一个`Highlight`对象被添加到`Highlighter`  

- [Highlighter.removeHighlights(highlights?: Highlight[])]()  

	删除一个或多个突出显示
