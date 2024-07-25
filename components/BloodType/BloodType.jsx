import styles from "./BloodType.module.css";

const BloodType = ({ active, value, clickCall, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={clickCall}
      className={active ? styles.activeButton : styles.defaultButton}
    >
      {value}
    </button>
  );
};

export default BloodType;
