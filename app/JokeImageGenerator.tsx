import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  ImageSourcePropType,
  Platform,
} from "react-native";
import {
  Svg,
  Rect,
  Text as SvgText,
  Image as SvgImage,
} from "react-native-svg";
import * as FileSystem from "expo-file-system";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Sharing from "expo-sharing";


const logoPath = require("../assets/images/logo.png"); // Logo JokeXP
// Image de fond pour l'application (fond d'écran Windows XP)
const image = {
  uri: "https://static.actu.fr/uploads/2021/03/13807881863-639a90e969-o.jpg",
};

// Importation des icônes du bureau
const folderIcon = require("../assets/images/windows-xp/mes documents - Windows XP.png");
const trashIcon = require("../assets/images/windows-xp/corbeille - Windows XP.png");
const xpIcon = require("../assets/images/windows-xp/logo - Windows XP.png");

// Interface pour les props du composant DesktopIcon
interface DesktopIconProps {
  label: string;
  image: ImageSourcePropType;
}

// Composant pour afficher une icône de bureau
const DesktopIcon: React.FC<DesktopIconProps> = ({ label, image }) => (
  <View style={styles.desktopIcon}>
    <Image source={image} style={styles.desktopLogo} />
    <Text style={styles.iconLabel}>{label}</Text>
  </View>
);

const JokeImageGenerator: React.FC<{ joke: string; onBack: () => void }> = ({
  joke,
  onBack,
}) => {
  const svgRef = useRef<Svg | null>(null);
  const [generatedImageUri, setGeneratedImageUri] = useState<string | null>(
    null
  );
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const generateAndShareImage = async () => {
    if (!svgRef.current) {
      console.error("svgRef.current est non défini.");
      return;
    }
  
    try {
      svgRef.current.toDataURL(
        async (svgData) => {
          const svgUri = `${FileSystem.cacheDirectory}jokeXP.png`;
          const base64Data = svgData.split(",")[1]; // Supprimer le préfixe Base64
          await FileSystem.writeAsStringAsync(svgUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });
  
          // Obtenir les dimensions de l'image (optionnel, si nécessaire)
          Image.getSize(
            svgUri,
            (width, height) => {
              setImageDimensions({ width, height });
              setGeneratedImageUri(svgUri);
  
              // Partager l'image après la génération
              shareImage(svgUri);
            },
            (error) => {
              console.error(
                "Erreur lors de la récupération des dimensions de l'image :",
                error
              );
            }
          );
        },
        {
          format: "png",
          quality: 1,
        }
      );
    } catch (error) {
      console.error("Erreur lors de la génération et du partage de l'image :", error);
    }
  };
  
  // Fonction pour partager l'image
  const shareImage = async (imageUri: string) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(imageUri, {
          mimeType: "image/png",
          dialogTitle: "Partager l'image de la blague",
          UTI: "public.png", // Type universel pour les fichiers PNG
        });
      } else {
        console.error("Partage non disponible sur cet appareil.");
      }
    } catch (error) {
      console.error("Erreur lors du partage de l'image :", error);
    }
  };
  
  const screenWidth = Dimensions.get("window").width;

  // Fonction pour diviser le texte en plusieurs lignes
  const splitTextIntoLines = (text: string, maxLineLength: number) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + word).length <= maxLineLength) {
        currentLine += `${word} `;
      } else {
        lines.push(currentLine.trim());
        currentLine = `${word} `;
      }
    });

    if (currentLine) {
      lines.push(currentLine.trim());
    }

    return lines;
  };

  const lines = splitTextIntoLines(joke, 20); // Divisez en lignes avec une limite de 20 caractères par ligne

  return (
    <ImageBackground source={image} style={styles.image}>
      <View style={styles.container}>
        {/* Fenêtre principale de l'application */}
        <View style={styles.windowContainer}>
          {/* Barre de titre */}
          <LinearGradient
            colors={["#3A94FE", "#015AEF", "#0168FB"]}
            locations={[0.1, 0.2, 0.6]}
          >
            <View style={styles.titleBar}>
              <Text style={styles.titleText}>Partager.exe</Text>
              <LinearGradient
                colors={["#E73800", "#EF8A73"]}
                start={{ x: 0.5, y: 0.8 }}
                end={{ x: 0, y: 0 }}
                style={styles.closeButton}
              >
                <TouchableOpacity style={styles.closeButton} onPress={onBack}>
                  <AntDesign name="close" size={16} color="white" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </LinearGradient>

          {/* Contenu principal */}
          <View
            style={[
              styles.contentContainer,
              generatedImageUri
                ? {
                    width: Math.min(screenWidth - 50, imageDimensions.width),
                    height: imageDimensions.height,
                  }
                : undefined,
            ]}
          >
            {generatedImageUri ? (
              // Affichage de l'image générée
              <Image
                source={{ uri: generatedImageUri }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
              />
            ) : (
              // Génération de l'image via SVG
              <Svg height="350" width="350" ref={svgRef}>
                <Rect width="350" height="350" fill="#015AEF" />
                {/* Texte divisé en plusieurs lignes */}
                {lines.map((line, index) => (
                  <SvgText
                    key={index}
                    x="50%"
                    y={`${120 + index * 35}`} // Positionnement vertical dynamique
                    fontSize="30"
                    fontWeight="Bold"
                    fill="white"
                    textAnchor="middle"
                  >
                    {line}
                  </SvgText>
                ))}
                <SvgImage
                  href={logoPath}
                  x="210"
                  y="290"
                  preserveAspectRatio="xMidYMid slice"
                />
              </Svg>
            )}
            {/* Boutons en bas */}
            <View style={styles.buttonContainer}>
              {generatedImageUri ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setGeneratedImageUri(null)}
                >
                  <Text style={styles.buttonText}>Modifier l'image</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.button} onPress={generateAndShareImage}>
                  <View style={styles.buttonShadow}>
                    <Text style={styles.buttonText}>Partager l'image</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        {/* Barre des tâches Windows XP */}
        <View style={styles.toolbarContainer}>
          <LinearGradient
            colors={["#3A94FE", "#015AEF", "#0168FB"]}
            locations={[0.1, 0.2, 0.6]}
          >
            <View style={styles.toolbarButtonStartContainer}>
              <LinearGradient
                colors={["#7EB87E", "#369537", "#44AD48"]}
                locations={[0.1, 0.2, 0.6]}
                style={styles.toolbarButtonStart}
              >
                <Image source={xpIcon} style={styles.toolbarLogo} />
                <Text style={styles.toolbarText}>démarrer</Text>
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    paddingTop: 30,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },

  windowContainer: {
    backgroundColor: "#ECE9D8", // Couleur de fond des fenêtres Windows XP
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden",
    width: "100%",
    maxWidth: 400,
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "#015AEF",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  closeButton: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "white",
    borderWidth: 1,
  },
  closeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  titleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 5,
  },
  contentContainer: {
    backgroundColor: "#E9E8D8",
    paddingTop: 10,
    minHeight: 150,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderColor: "#015AEF",
  },
  desktopIconsContainer: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  desktopIcon: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconLabel: {
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginTop: 5,
    textAlign: "center",
  },
  desktopLogo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  button: {
    margin: 10,
    borderWidth: 2,
    borderColor: "#333",
    overflow: "hidden",
  },
  buttonShadow: {
    borderWidth: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopColor: "white",
    borderLeftColor: "white",
    borderRightColor: "#C1C0B4",
    borderBottomColor: "#C1C0B4",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  toolbarContainer: {
    height: 50,
    width: "200%",
    backgroundColor: "blue",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  toolbarButtonStartContainer: {
    width: 170,
    borderRadius: 100,
  },
  toolbarButtonStart: {
    borderTopRightRadius: 500,
  },
  toolbarText: {
    color: "white",
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: Platform.OS === "ios" ? 20 : 16,
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    paddingVertical: 15,
    paddingLeft: 50,
  },
  toolbarLogo: {
    height: 20,
    width: 20,
    position: "absolute",
    left: 25,
    bottom: 14,
  },
});

export default JokeImageGenerator;
