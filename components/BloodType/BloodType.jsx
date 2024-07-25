import styles from "./BloodType.module.css";

const BloodType = ({ active, value, clickCall, disabled }) => {
  const handleClick = (event) => {
    if (disabled) return;

    clickCall(event);
  };

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={active ? styles.activeButton : styles.defaultButton}
    >
      {value}
    </button>
  );
};

export default BloodType;
