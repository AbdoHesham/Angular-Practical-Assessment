import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebAuthnService {

  // Generates a random buffer to use as a challenge, which is a unique value needed for security
  private generateRandomBuffer(length: number): Uint8Array {
    const randomBuffer = new Uint8Array(length);
    window.crypto.getRandomValues(randomBuffer); // Fills the buffer with cryptographically secure random values
    return randomBuffer;
  }

  // Registers a new credential (like a fingerprint or Face ID) for the user
  async register() {
    // Generate a unique challenge for the registration process
    const challenge = this.generateRandomBuffer(32);

    // PublicKeyCredentialCreationOptions is the core object needed for registration
    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge: challenge, // A random value generated by the server to ensure the request is fresh and unique
      rp: { // Relying Party (your app) information
        name: "OurAwesomeApp" // Display name of your app
      },
      user: { // User information
        id: this.generateRandomBuffer(16), // A unique identifier for the user
        name: "user@example.com", // User's email or username
        displayName: "User Example" // A friendly name for the user
      },
      pubKeyCredParams: [{ // Array of acceptable public key algorithms
        type: "public-key",
        alg: -7  // Represents the ES256 algorithm (Elliptic Curve Digital Signature Algorithm)
      }],
      authenticatorSelection: { // Criteria for selecting the appropriate authenticator
        authenticatorAttachment: "platform", // Ensures we use the device's built-in biometric authenticator like Touch ID or Face ID
        userVerification: "required" // Requires user verification (e.g., fingerprint or face scan)
      },
      timeout: 60000, // Timeout for the registration operation in milliseconds
      attestation: "direct" // Attestation provides proof of the authenticator's properties and is sent back to the server
    };

    try {
      // This will prompt the user to register their biometric credential
      const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;
      this.storeCredential(credential, challenge); // Store the credential details locally for demo purposes
      console.log("Registration successful!", credential);
      return credential; // Return the credential object containing the user's public key and other details
    } catch (err) {
      console.error("Registration failed:", err);
      throw err; // Handle any errors that occur during registration
    }
  }

  // Authenticates the user with stored credentials (like a fingerprint or Face ID)
  async authenticate() {
    const storedCredential = this.getStoredCredential(); // Retrieve stored credential information
    if (!storedCredential) {
      throw new Error("No stored credential found. Please register first."); // Error if no credentials are found
    }

    // PublicKeyCredentialRequestOptions is used to prompt the user to authenticate
    const publicKey: PublicKeyCredentialRequestOptions = {
      challenge: new Uint8Array(storedCredential.challenge), // A new challenge to ensure the request is fresh and unique
      allowCredentials: [{ // Specifies which credentials can be used for authentication
        id: new Uint8Array(storedCredential.rawId), // The ID of the credential to use
        type: "public-key"
      }],
      userVerification: "required", // Requires user verification (e.g., fingerprint or face scan)
      timeout: 60000 // Timeout for the authentication operation in milliseconds
    };

    try {
      // This will prompt the user to authenticate using their registered biometric credential
      const credential = await navigator.credentials.get({ publicKey }) as PublicKeyCredential;
      console.log("Authentication successful!", credential);
      return credential; // Return the credential object with authentication details
    } catch (err) {
      console.error("Authentication failed:", err);
      throw err; // Handle any errors that occur during authentication
    }
  }

  // Stores credential data in localStorage (for demo purposes only; this should be handled securely in production)
  private storeCredential(credential: PublicKeyCredential, challenge: Uint8Array) {
    const credentialData = {
      rawId: Array.from(new Uint8Array(credential.rawId)), // Converts the raw ID to an array for storage
      challenge: Array.from(challenge) // Converts the challenge to an array for storage
    };
    localStorage.setItem('webauthn_credential', JSON.stringify(credentialData)); // Store the data as a JSON string
  }

  // Retrieves stored credential data from localStorage
  private getStoredCredential(): any {
    const storedCredential = localStorage.getItem('webauthn_credential');
    return storedCredential ? JSON.parse(storedCredential) : null; // Parse the stored JSON back into an object
  }
}