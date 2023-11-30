import * as React from "react";
import { IMaskInput } from "react-imask";

const CepMask = React.forwardRef(function CepMask(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="#####-###"
      definitions={{
        "#": /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

export default CepMask;
