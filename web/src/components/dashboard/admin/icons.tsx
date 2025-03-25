import { type ReactNode } from 'react';
import Image from "next/image";

interface IconProps {
  className?: string;
  active?: boolean;
  hover?: boolean;
}

export const DashboardIcon = ({ className }: IconProps): ReactNode => (
  <Image 
    src={`/icons/dashboard/admin/dashboard.svg`}
    alt="dashboard icon"
    width={18}
    height={22}
    className={className}
  />
);

export const ServicesIcon = ({ className }: IconProps): ReactNode => (
  <Image 
    src={`/icons/dashboard/admin/services.svg`}
    alt="services icon"
    width={18}
    height={22}
    className={className}
  />
);

export const ContactIcon = ({ className }: IconProps): ReactNode => (
  <Image 
    src={`/icons/dashboard/admin/contact.svg`}
    alt="contact icon"
    width={18}
    height={22}
    className={className}
  />
);

export const SettingsIcon = ({ className }: IconProps): ReactNode => (
  <Image 
    src={`/icons/dashboard/admin/settings.svg`}
    alt="settings icon"
    width={18}
    height={22}
    className={className}
  />
);

export const AccountIcon = ({ className }: IconProps): ReactNode => (
  <svg width="27" height="25" viewBox="0 0 27 25" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.7539 13.6777C20.2952 14.6465 21.3752 15.959 21.3752 17.709V20.834H25.8752V17.709C25.8752 15.4382 21.8589 14.0944 18.7539 13.6777Z" fill="currentColor"/>
    <path d="M16.8752 12.5003C19.3614 12.5003 21.3752 10.6357 21.3752 8.33366C21.3752 6.03158 19.3614 4.16699 16.8752 4.16699C16.3464 4.16699 15.8514 4.27116 15.3789 4.41699C16.3127 5.48991 16.8752 6.85449 16.8752 8.33366C16.8752 9.81283 16.3127 11.1774 15.3789 12.2503C15.8514 12.3962 16.3464 12.5003 16.8752 12.5003Z" fill="currentColor"/>
    <path d="M10.125 12.5003C12.6112 12.5003 14.625 10.6357 14.625 8.33366C14.625 6.03158 12.6112 4.16699 10.125 4.16699C7.63875 4.16699 5.625 6.03158 5.625 8.33366C5.625 10.6357 7.63875 12.5003 10.125 12.5003ZM10.125 6.25033C11.3625 6.25033 12.375 7.18783 12.375 8.33366C12.375 9.47949 11.3625 10.417 10.125 10.417C8.8875 10.417 7.875 9.47949 7.875 8.33366C7.875 7.18783 8.8875 6.25033 10.125 6.25033Z" fill="currentColor"/>
    <path d="M10.125 13.542C7.12125 13.542 1.125 14.9378 1.125 17.7087V20.8337H19.125V17.7087C19.125 14.9378 13.1287 13.542 10.125 13.542ZM16.875 18.7503H3.375V17.7191C3.6 16.9691 7.0875 15.6253 10.125 15.6253C13.1625 15.6253 16.65 16.9691 16.875 17.7087V18.7503Z" fill="currentColor"/>
  </svg>
);

export const LogoutIcon = ({ className }: IconProps): ReactNode => (
  <Image 
    src={`/icons/dashboard/admin/Logout.svg`}
    alt="Logout icon"
    width={18}
    height={22}
    className={className}
  />
);

export const NotificationIcon = ({ className, active, hover }: IconProps): ReactNode => (
  <Image 
    src={`/icons/notification${(active || hover) ? "" : "-white"}.svg`}
    alt="notification"
    width={18}
    height={22}
    className={className}
  />
);