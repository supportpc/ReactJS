import React from "react";
import { ColorPickerComponent } from "@syncfusion/ej2-react-inputs";


const change = (args) => {
  document.getElementById("preview").style.backgroundColor =
    args.currentValue.hex;
};

const CustomColorPicker = ({ id, mode }) => (
  <ColorPickerComponent
    id={id}
    mode={mode}
    modeSwitcher={false}
    inline
    showButtons={false}
    change={change}
  />
);

const ColorPicker = () => (
  <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
    <div className="text-center">
      <div id="preview" />
      <div className="flex justify-center items-center gap-20 flex-wrap">
        <div>
          <p className="text-2xl font-semibold mt-2 mb-4">Inline Pallete</p>
          <CustomColorPicker id="inline-palette" mode="Palette" />
        </div>
        <div>
          <p className="text-2xl font-semibold mt-2 mb-4">Inline Picker</p>
          <CustomColorPicker id="inline-picker" mode="Picker" />
        </div>
      </div>
    </div>
  </div>
);

export default ColorPicker;


// npm install @syncfusion/ej2-react-inputs@19.4.52 @syncfusion/ej2-inputs@19.4.50 @syncfusion/ej2-base@19.4.50 @syncfusion/ej2-buttons@19.4.50 @syncfusion/ej2-popups@19.4.50 @syncfusion/ej2-splitbuttons@19.4.50 @syncfusion/ej2-lists@19.4.50 @syncfusion/ej2-navigations@19.4.50 @syncfusion/ej2-dropdowns@19.4.50