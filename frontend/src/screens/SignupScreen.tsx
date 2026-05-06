import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context";

type Props = StackScreenProps<RootStackParamList, "Signup">;

export const SignupScreen = ({ navigation }: Props) => {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await signup(name, email, password);
    } catch (error: any) {
      Alert.alert("Signup failed", error?.response?.data?.message || "Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Signup</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10 }}
      />
      <Button title={loading ? "Creating account..." : "Signup"} onPress={handleSignup} disabled={loading} />
      <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};
