
import React from 'react';

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955M3 11.25V21h6V15h6v6h6V11.25M12 2.25V5.25" />
  </svg>
);

export const SwordsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const BookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // Used for World/Lore
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

export const DiceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {/* A more generic die icon */}
    <rect x="5" y="5" width="14" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9.5" cy="9.5" r="1" fill="currentColor" />
    <circle cx="14.5" cy="9.5" r="1" fill="currentColor" />
    <circle cx="9.5" cy="14.5" r="1" fill="currentColor" />
    <circle cx="14.5" cy="14.5" r="1" fill="currentColor" />
     <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);


export const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // Generic chat/dialogue
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-2.184-2.183a11.25 11.25 0 00-1.278-.291M15.75 12V5.786c0-.97-.616-1.812-1.5-2.097A48.748 48.748 0 0012 3c-2.392 0-4.744.175-7.043.513C3.616 3.974 3 4.814 3 5.786v4.286M3 12c0 .285.021.565.062.844m19.876-1.682c.041.279.062.56.062.843m-12.252 5.042L9 17.25m3-3v3M9 12.75H6.75m11.25 0H15M9 9.75h3.375M15 9.75h-3.375M12 6.75V9.75" />
  </svg>
);

export const CastleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m16.5-18v18m-1.5-18l-3.75 3.75m0 0L12 3.75M16.5 7.5l3.75 3.75M3.75 7.5l3.75 3.75m1.5-4.5V21m0-18h-3.75m3.75 0h3.75M9 3.75V21m0-18H5.25m3.75 0H1.5M15 3.75V21m0-18h3.75m-3.75 0h-3.75m3 9l2.25 2.25L15 18l-2.25-2.25L15 13.5z" />
  </svg>
);

export const PotionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.07c0 .498.203.971.57 1.338L12 11.25l1.68-1.738c.367-.367.57-.84.57-1.338v-5.07M12 3.104A2.25 2.25 0 009.75 5.354M12 3.104A2.25 2.25 0 0114.25 5.354M15 20.25H9c-.621 0-1.125-.504-1.125-1.125V12.75A2.25 2.25 0 019.75 10.5h4.5a2.25 2.25 0 011.875 2.25V19.125c0 .621-.504 1.125-1.125 1.125z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 14.25h3M10.5 16.5h3" /> {/* Bubbles or liquid level */}
  </svg>
);

export const TargetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // Game Features / Goals
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01" />
  </svg>
);

export const MapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // World Map
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
  </svg>
);

export const ScrollIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // World Description / Lore
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2zM12 9V3.75M9 13.5h6M9 16.5h4" />
  </svg>
);

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // Item Generation
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l1.688-1.688a1.875 1.875 0 10-2.652-2.652L15.75 5.25m2.5 2.25l1.5-1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414-1.414M6.05 17.95l-1.414-1.414m11.314 0l-1.414 1.414M6.05 6.05l-1.414 1.414" />
  </svg>
);

export const BackpackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // Inventory
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6.75h-9a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5V8.25a1.5 1.5 0 00-1.5-1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75A2.25 2.25 0 009.75 6v.75m4.5-.75V6A2.25 2.25 0 0012 3.75M12 3.75h.008v.008H12V3.75zm0 0c.32 0 .627.025.922.072M9.75 6.75H7.5M14.25 6.75H16.5" />
  </svg>
);

export const PlayerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // Character Icon
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export const WorldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // Create World / World Details / "Worlds" section
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c1.657 0 3-4.03 3-9s-1.343-9-3-9-3 4.03-3 9 1.343 9 3 9zM2.885 12H21.115" />
  </svg>
);

export const AdventureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // Adventure Mode / Dungeon Master
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1.5 1.5m1.5-1.5V4.5m0 12V6.75m0 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
);

export const DeleteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.242.078 3.324.214M9.06 5.79L9.062 5.79m.001-.001L9.06 5.79z" />
  </svg>
);

export const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

// TransferIcon removed
// NpcIcon removed
