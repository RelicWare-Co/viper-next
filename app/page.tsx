import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@mantine/core";

export default function Home() {
  return (
    <div className={styles.page}>
      <Button>Button</Button>
    </div>
  );
}
