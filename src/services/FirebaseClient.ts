import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export class FirebaseClient {
    public isLoggedIn: boolean;
    private config: any;

    constructor(config: any) {
        this.isLoggedIn = false;
        this.config = config;

        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged((user) => {
            this.isLoggedIn = user !== null;
        });
    }

    public async signIn(): Promise<firebase.auth.UserCredential> {
        if (this.isLoggedIn) {
            await firebase.auth().signOut();
        }
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope(this.config.scopes.join(' '));
        return firebase.auth().signInWithPopup(provider);
    }

    public async fetchSearchUrl(): Promise<[string, string, string]> {
        return firebase
            .database()
            .ref('/consts')
            .once('value')
            .then((snapshot) => {
                return Promise.all([
                    snapshot.ref
                        .child('url')
                        .once('value')
                        .then((s) => s.val()),
                    snapshot.ref
                        .child('token')
                        .once('value')
                        .then((s) => s.val()),
                    snapshot.ref
                        .child('index')
                        .once('value')
                        .then((s) => s.val()),
                ]);
            });
    }
}
