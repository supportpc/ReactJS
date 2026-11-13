import React from "react";
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";


const Editor = () => (
  <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
    <RichTextEditorComponent>
      <Inject services={[HtmlEditor, Toolbar, Image, Link, QuickToolbar]} />
    </RichTextEditorComponent>
  </div>
);
export default Editor;


// npm install @syncfusion/ej2-react-richtexteditor@19.4.50 @syncfusion/ej2-richtexteditor@19.4.50 @syncfusion/ej2-base@19.4.50 @syncfusion/ej2-buttons@19.4.50 @syncfusion/ej2-popups@19.4.50 @syncfusion/ej2-splitbuttons@19.4.50 @syncfusion/ej2-inputs@19.4.50 @syncfusion/ej2-lists@19.4.50 @syncfusion/ej2-navigations@19.4.50 @syncfusion/ej2-dropdowns@19.4.50
