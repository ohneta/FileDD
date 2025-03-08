/**
 * <input>要素の type="file"型拡張
 * 画像ファイルドラッグ＆ドロップ対応 ファイル選択カスタム要素
 *
 * <file-dd>
 *  要素名 file-dd
 *  ファイル名 FileDD.js
 *  属性
 *    accept 固有ファイル種別指定子。<input type="file">のaccept属性と同等
 *    name   <input type="file">のname属性と同等
 *    img-id プレビューimg要素のid属性。このIDで指定されたimg要素にプレビューデータを設定される。
 *  例 
 *     <div>
 *       <img id="preview" />
 *       <file-dd name="imagefile" accept="image/png, image/jpeg" img-id="preview" />
 *     </div>
 *
 *  ::part(file-button)
 *    file-dd要素のshadowDOM内の<input type="file">へは "file-button" として::part()で参照可能。
 */

class FileDD extends HTMLElement {

  static formAssociated = true; // formに参加表明
  static observedAttributes = [ "accept", "name",  "img-id" ];

  accept = null;
  fileInputElement = null;
  imgId = null;
  imgElement = null;
  imgSrcDefault = null;   // 起動時にimg-idに設定されている画像情報

  constructor() {
    super();
  }

  connectedCallback() {
    if (this.hasAttribute('name')) {
      if (this.fileInputElement != null) {
        this.fileInputElement.name = this.getAttribute('name');
      }
    }

    this._updateRendering();
  }

  disconnectedCallback() {
  }

  adoptedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'accept') {
      this.accept = newValue;
    }
    if (name == 'img-id') {
      this.imgId = newValue;
      this.imgSrcDefault = document.getElementById(this.imgId).src;
    }
    if (name === 'name') {
      if (this.fileInputElement != null)
        this.fileInputElement.name = newValue;
    }
  }


  get accept() {
    return this.accept;
  }
  set accept(v) {
    this.setAttribute("accept", v);
  }

  get name() {
    return this.getAttribute('name');
  }

  set name(val) {
    this.setAttribute('name', val);
  }

  formAssociatedCallback() {
    this.internals = this.attachInternals();
    if (this.fileInputElement != null)
      this.internals.setFormValue(this.fileInputElement.files.item(0));  // とりあえず1ファイルのみ対応
  }


  //--------------------

  _updateRendering() {
    // LightDOMにあるプレビュー用のimgタグをidで取得しておく
    if (this.imgId != null) {
      this.imgElement = document.getElementById(this.imgId);
    }

    if (this.shadowRoot == null)
      this.attachShadow({mode: 'open'});

    const parentElement = document.createElement("div");
    this.fileInputElement = document.createElement('input');
    this.fileInputElement.setAttribute('part', 'file-button');


    // drag&dropイベント
    parentElement.addEventListener('dragover', (event) => {
      event.stopPropagation();
      event.preventDefault();
      parentElement.style.border = "solid";
	  });
    parentElement.addEventListener('dragenter', (event) => {
      event.stopPropagation();
      event.preventDefault();
      parentElement.style.border = "solid";
	  });
    parentElement.addEventListener('dragleave', (event) => {
      event.stopPropagation();
      event.preventDefault();
      parentElement.style.border = "";
	  });
    parentElement.addEventListener('drop', (event) => {
      event.stopPropagation();
      event.preventDefault();
      parentElement.style.border = "";

      // ドロップオブジェクトのうち、ファイルのみを取得
      let dropFiles = [];
      if (event.dataTransfer.items) {
        [...event.dataTransfer.items].forEach((item, i) => {
          if (item.kind === "file") {
            const file = item.getAsFile();
            dropFiles[i] = file;
          }
        });
      } else {
        [...evt.dataTransfer.files].forEach((file, i) => {
          dropFiles[i] = file;
        });
      }

      // imageファイルか？
      let isImageFileFlag = false;
      if (this.accept == 'image/*') {   // "image/*" 対応
        const types = dropFiles[0].type.split('/');
        if (types[0] == 'image') {
          isImageFileFlag = true;
        }
      } else {                          // "image/png, image/jpeg ..." など accept の個別対応
        if (this.accept.includes(dropFiles[0].type)) {
          isImageFileFlag = true;
        }
      }

      if (isImageFileFlag) {
        // input filesの置き換え
        const dataTransfer = new DataTransfer();
        Array.from(dropFiles).forEach(file => {
          dataTransfer.items.add(file);
        });
        this.fileInputElement.files = dataTransfer.files;
        this.internals.setFormValue(this.fileInputElement.files.item(0));
        if (this.imgElement != null) {
         this._previewImage(this.imgElement, dropFiles[0]);
        }
      } else {
        console.log("dropped files not accepted");
      }

    });

    //--------
    {
      this.fileInputElement.type = 'file';
      this.fileInputElement.accept = this.accept;
      this.fileInputElement.addEventListener('change', (event) => {

        if (this.fileInputElement.files.length === 0) {
          console.log('canceled file select');
        }

        this.internals.setFormValue(this.fileInputElement.files.item(0));
       this._previewImage(this.imgElement, event.target.files[0]);
      });
    }

    const fileInputDivElement = document.createElement('div');
    {
      this.fileInputElement.textAlign = "left";
      fileInputDivElement.appendChild(this.fileInputElement);
      fileInputDivElement.justifyContent = "start";
    }
    parentElement.append(fileInputDivElement);

    this.shadowRoot.replaceChildren(parentElement);

  }

  //--------------------
  /**
   * プレビュー要素に画像を反映
   *
   * @param {Element} imgElement  画像ファイルプレビュー要素
   * @param {File} file プレビューする画像ファイル
   * @return {void}
   */
  _previewImage(imgElement, file) {
    if ((file === undefined) || (file === null)) {
      imgElement.src = this.imgSrcDefault;

    } else {
      imgElement.src = window.URL.createObjectURL(file);
      imgElement.onload = () => {
        URL.revokeObjectURL(imgElement.src);
      };
    }
  }

}

customElements.define("file-dd", FileDD);
