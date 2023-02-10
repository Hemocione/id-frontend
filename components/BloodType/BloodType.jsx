import styles from "./BloodType.module.css";

const BloodType = ({ active, value, onClick }) => (
  <button
    onClick={onClick}
    className={active ? styles.activeButton : styles.defaultButton}
  >
    {value}
  </button>
);

export default BloodType;
