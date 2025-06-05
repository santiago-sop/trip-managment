import { ReactElement, SVGProps, cloneElement } from "react";
import styles from "./ActivityCard.module.css";

interface ActivityCardProps {
  title: string;
  description: string;
  location: string;
  icon: ReactElement<SVGProps<SVGSVGElement>>;
}

export default function ActivityCard({
  title,
  description,
  location,
  icon,
}: ActivityCardProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.lineCard}></div>
      <div className={styles.location}>
        {cloneElement(icon, { className: styles.icon })}
        <span>{location}</span>
      </div>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
