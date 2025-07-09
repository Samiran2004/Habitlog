import { Image } from 'expo-image';
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { Text, TextInput, useTheme } from 'react-native-paper'
// import { Button, ButtonText } from "@/components/ui/button"
import { Button } from 'react-native-paper';
import { useAuth } from '../lib/auth-context';
import { useRouter } from 'expo-router';

export default function Auth() {

    const theam = useTheme();
    const router = useRouter();

    const { signIn, signUp } = useAuth();

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSwitchMode = () => {
        setIsSignUp((prev) => !prev);
    }

    const handleAuth = async () => {
        if (!email || !password) {
            setError("Please fill all fields.");
            return;
        }

        if (password.length < 4) {
            setError("Password must be at-least 4 characters long.");
            return;
        }
        setError(null);

        if (isSignUp) {
            const error = await signUp(email, password);
            if (error) {
                setError(error);
                return;
            }
        } else {
            const error = await signIn(email, password);
            if (error) {
                setError(error);
                return;
            }
        }

        router.replace("/");

    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'android' ? "height" : "padding"} style={styles.container}>
            <View style={styles.content}>

                <Image
                    source={require('../assets/images/welcome_logo.jpg')}
                    style={{
                        width: 200,
                        height: 200,
                        borderRadius: 50,
                        alignSelf: 'center',
                        marginBottom: 20,
                    }}
                    contentFit="cover"
                    transition={200}
                />

                <Text style={styles.title}>
                    {isSignUp ? "Create Account" : "Welcome Back"}
                </Text>

                <TextInput
                    style={styles.input}
                    label="Email"
                    autoCapitalize='none'
                    keyboardType='email-address'
                    placeholder='example@gmail.com'
                    mode='outlined'
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    label="Password"
                    autoCapitalize='none'
                    keyboardType='visible-password'
                    mode='outlined'
                    onChangeText={setPassword}
                />

                {
                    error && (
                        <Text style={{ color: theam.colors.error }}>{error}</Text>
                    )
                }

                <View style={{ alignItems: 'center' }}>
                    <Button
                        icon="login"
                        mode="contained"
                        style={styles.button}
                        onPress={handleAuth}
                    >
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </Button>
                </View>


                <Button mode='text' onPress={handleSwitchMode}>
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </Button>

            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    content: {
        flex: 1,
        // backgroundColor: 'red',
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 25,
        fontSize: 30,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 20,
        borderWidth: 0,
        borderColor: 'transparent'
    },
    button: {
        width: 150,
        borderRadius: 10,
        height: 50,
        // flex: 1,
        justifyContent: 'center',
        backgroundColor: 'coral',
        borderColor: 'black',
        borderWidth: 1.4
    }
})