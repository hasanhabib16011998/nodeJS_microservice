Setup environment variables:

go to vite-env.d.ts and write this code:

/// <reference types="vite/client" />


interface ImportMetaEnv {
    readonly VITE_ENVIRONMENT_NAME: string;
}

interface ImportMeta{
    readonly env: ImportMetaEnv
}

