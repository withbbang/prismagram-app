import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { AsyncStorage } from "react-native";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo-hooks";
import { ThemeProvider } from "styled-components";
import apolloClientOptions from "./apollo";
import NavController from "./components/NavController";
import { AuthProvider } from "./AuthContext";
import styles from "./styles";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [loaded, setloaded] = useState(false);
  const [client, setClient] = useState(null);
  const preLoad = async () => {
    try {
      await Font.loadAsync({
        ...Ionicons.font,
      });
      await Asset.loadAsync([require("./assets/Youngstagram_1.png")]);
      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: AsyncStorage,
      });
      const client = new ApolloClient({
        cache,
        request: async (operation) => {
          const token = await AsyncStorage.getItem("jwt");
          return operation.setContext({
            headers: { Authorization: `Bearer ${token}` },
          });
        },
        ...apolloClientOptions,
      });
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (isLoggedIn === null || isLoggedIn === "false") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      setloaded(true);
      setClient(client);
    } catch (e) {
      console.log("Error : ", e);
    }
  };

  useEffect(() => {
    preLoad();
  }, []);

  return loaded && client && isLoggedIn !== null ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
        <AuthProvider isLoggedIn={isLoggedIn}>
          <NavController />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
}
