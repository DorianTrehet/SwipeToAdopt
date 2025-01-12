# SwipeToAdopt

## Description
SwipeToAdopt est une application web permettant aux utilisateurs de swiper des animaux pour les adopter. L'application utilise React pour le frontend et Node.js avec Express pour le backend.

## Installation

### Prérequis
- Node.js (version 14 ou supérieure)
- npm (version 6 ou supérieure)
- MongoDB (base de données)

### Étapes d'installation

1. Clonez le dépôt :
    ```sh
    git clone https://github.com/DorianTrehet/SwipeToAdopt.git
    cd swipetoadopt
    ```
2. Installez les dépendances :
    ```sh
    npm install
    npm install react@^18.3.1 react-dom@^18.3.1 react-router-dom@^6.27.0 react-scripts@5.0.1 react-tinder-card@^1.6.4 @react-spring/web@^9.5.5 axios@^1.7.7 socket.io-client@^4.8.1 express@^4.21.1 mongoose@^8.9.4 bcryptjs@^2.4.3 jsonwebtoken@^9.0.2 config@^3.3.12 dotenv@^16.4.7 socket.io@^4.8.1 winston@^3.17.0
    ```

3. Configurez les variables d'environnement :
    - Créez un fichier [.env] dans le dossier [backend] avec le contenu suivant :
      ```
      MONGO_URI=your_mongodb_connection_string
      PORT=5000
      ```

4. Pour peupler la base de données :
    ```sh
    cd backend
    node seed.js
    ```

5. Démarrez le serveur backend :
    ```sh
    cd backend
    node server.js
    ```

6. Démarrez le serveur frontend :
    ```sh
    npm start
    ```
