# Custom Element for Image File Selection　(画像ファイル選択カスタム要素)
An extension of `<input type="file">`  
`<input type="file">`の拡張

## Features (提供機能)
* File drag-and-drop (ファイルのドロップ)
* Image file preview (画像ファイルのプレビュー)

### File Drag-and-Drop (ファイルのドロップ)
You can drop image files within the content area of the element.
要素のコンテンツ領域で画像ファイルのドロップできます。

### Image File Preview (画像ファイルのプレビュー)
By specifying the `id` of an `img` element for preview, the selected image file can be displayed.  
プレビュー用のimg要素のidを指定することで、選ばれた画像ファイルをプレビューできます。

## Script File (スクリプトファイル)
|||
|-|-|
|File Name (ファイル名)|FileDD.js|
|Element Name (要素名)|file-dd|

## 書式 (Syntax)
```html
<file-dd></file-dd>
```

### Attributes　(属性)
|||
|-|-|
|accept | Specifies allowed file types. Equivalent to the `accept` attribute of `<input type="file">` <br>固有ファイル種別指定子。`<input type="file">`のaccept属性と同等|
|name   | Equivalent to the `name` attribute of `<input type="file">`　<br>`<input type="file">`のname属性と同等|
|img-id | The `id` of the preview `img` element. The preview data will be set to the `img` element specified by this id. <br>プレビューimg要素のid属性。このidで指定されたimg要素にプレビューデータを設定される。|


## Shadow DOM (::part)
|||
|-|-|
|file-button| The `<input type="file">` inside the shadow DOM of `file-dd` can be referenced using `::part("file-button")`. <br>file-dd要素のshadowDOM内の<input type="file">へは "file-button" として::part()で参照可能。|


## Examples (例)
### Minimal Usage (最小)
```html
<div>
  <file-dd name="imagefile" accept="image/png, image/jpeg"></file-dd>
</div>
```

### With Image Preview (画像プレビュー付き)
```html
<div>
  <img id="preview1">
  <file-dd name="imagefile1" accept="image/*" img-id="preview1"></file-dd>

  <img id="preview2">
  <file-dd name="imagefile2" accept="image/png, image/jpeg" img-id="preview2"></file-dd>
 </div>
```

## more...
Refer to the included index.html.
(同梱の [index.html](./index.html) を参照)

