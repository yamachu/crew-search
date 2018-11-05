declare module '*/firebaseConfig.json' {
    interface FirebaseConfig {
        apiKey: string;
        authDomain: string;
        databaseURL: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        clientId: string;
        scopes: string[];
    }

    const value: FirebaseConfig;
    export = value;
}
