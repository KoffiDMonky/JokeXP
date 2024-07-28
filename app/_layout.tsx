// Importation des dépendances nécessaires
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground, Image, ImageSourcePropType, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

// URL de l'API pour récupérer les blagues
const API_URL = 'https://v2.jokeapi.dev/joke/Any?lang=fr&blacklistFlags=religious,political,racist,sexist&safe-mode';

// Image de fond pour l'application (fond d'écran Windows XP)
const image = { uri: "https://static.actu.fr/uploads/2021/03/13807881863-639a90e969-o.jpg" };

// Importation des icônes du bureau
const folderIcon = require('../assets/images/windows-xp/mes documents - Windows XP.png');
const trashIcon = require('../assets/images/windows-xp/corbeille - Windows XP.png');
const xpIcon = require('../assets/images/windows-xp/logo - Windows XP.png');

// Interface pour les props du composant DesktopIcon
interface DesktopIconProps {
  label: string;
  image: ImageSourcePropType;
}

// Composant pour afficher une icône de bureau
const DesktopIcon: React.FC<DesktopIconProps> = ({ label, image }) => (
  <View style={styles.desktopIcon}>
    <Image
          source={image}
          style={styles.desktopLogo}
        />
    <Text style={styles.iconLabel}>{label}</Text>
  </View>
);

// Composant principal de l'application
const Joke = () => {
  // États pour stocker la blague et l'état de chargement
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer une blague depuis l'API
  const fetchJoke = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setJoke(data.type === 'single' ? data.joke : `${data.setup} ... ${data.delivery}`);
    } catch (error) {
      setJoke('Impossible de récupérer une blague.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Effet pour charger une blague au démarrage de l'application
  useEffect(() => {
    fetchJoke();
  }, [fetchJoke]);

  return (
    <ImageBackground source={image} style={styles.image}>
      <View style={styles.container}>
        {/* Conteneur pour les icônes de bureau */}
        <View style={styles.desktopIconsContainer}>
          <DesktopIcon label="Mes documents" image={folderIcon}/>
          <DesktopIcon label="Corbeille" image={trashIcon} />
        </View>
        {/* Fenêtre principale de l'application */}
        <View style={styles.windowContainer}>
          {/* Barre de titre de la fenêtre */}
          <LinearGradient
              colors={['#3A94FE','#015AEF','#0168FB']}
              locations={[0.1,0.20, 0.6]}
            >
            <View style={styles.titleBar}>
              <Text style={styles.titleText}>Blague de Papa.exe</Text>
              {/* Bouton de fermeture */}
              <LinearGradient
                colors={['#E73800','#EF8A73']}
                start={{ x: 0.5, y: 0.8 }}
                end={{ x: 0, y: 0 }}
                style={styles.closeButton}
              >
                <TouchableOpacity style={styles.closeButton}>
                  <AntDesign name="close" size={16} color="white" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </LinearGradient>
          {/* Contenu de la fenêtre */}
          <View style={styles.jokeContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#015AEF" />
            ) : (
              <Text style={styles.jokeText}>{joke}</Text>
            )}
            {/* Bouton pour obtenir une nouvelle blague */}
            <TouchableOpacity style={styles.button} onPress={fetchJoke}>
              <View style={styles.buttonShadow}>
                <Text style={styles.buttonText}>Obtenir une autre blague</Text>
              </View>           
            </TouchableOpacity>
          </View>
        </View>
        {/* Barre des tâches Windows XP */}
        <View style={styles.toolbarContainer}>          
          <LinearGradient
            colors={['#3A94FE','#015AEF','#0168FB']}
            locations={[0.1,0.20, 0.6]}
          >
            <View style={styles.toolbarButtonStartContainer}>
              <LinearGradient
                colors={['#7EB87E','#369537','#44AD48']}
                locations={[0.1,0.20, 0.6]}
                style={styles.toolbarButtonStart}
              >
                <Image source={xpIcon} style={styles.toolbarLogo}/>
                <Text style={styles.toolbarText}>démarrer</Text>
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>
      </View>
    </ImageBackground>
  );
};

// Styles pour l'application
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  windowContainer: {
    backgroundColor: '#ECE9D8', // Couleur de fond des fenêtres Windows XP
   borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 400,
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2
    ,
    borderColor: '#015AEF',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1
  },
  closeButton: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'white',
    borderWidth: 1
  },
  closeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  jokeContainer: {
    backgroundColor: '#E9E8D8',
    padding: 20,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderColor: '#015AEF',
  },
  jokeText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    padding: 20
  },
  button: {
    margin: 10,
    borderWidth: 2,
    borderColor: '#333',
    overflow: 'hidden',

  },
  buttonShadow: {
    borderWidth: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: '#C1C0B4',
    borderBottomColor: '#C1C0B4',

  },
  buttonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  desktopIconsContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  desktopIcon: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconLabel: {
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginTop: 5,
    textAlign: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    paddingTop: 30
  },
  desktopLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  toolbarContainer: {
    height: 50,
    width: '200%',
    backgroundColor: 'blue',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  toolbarButtonStartContainer: {
    width: 170,
    borderRadius: 100,
  },
  toolbarButtonStart: {
    borderTopRightRadius:500,
   },
  toolbarText: {
    color: 'white',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: Platform.OS === 'ios' ? 20 : 16,
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
    paddingVertical: 15,
    paddingLeft: 50
  },
  toolbarLogo: {
    height: 20,
    width: 20,
    position: 'absolute',
    left: 25,
    bottom: 14
  }
});

export default Joke;