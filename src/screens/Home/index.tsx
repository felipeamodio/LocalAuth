import { useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

import * as S from './styles';
import { Alert } from 'react-native';

export default function Home(){
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // função que verifica a possibilidade de autenticar com biometria
    async function verifyAvaiableAuthentication() {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        console.log(compatible);

        //quais os tipos que estão disponíveis para a autenticação
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        console.log(types.map(type => LocalAuthentication.AuthenticationType[type]));
    }

    // verificar se existe alguma biometria cadastrada
    async function handleAuthentication() {
        const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();

        if(!isBiometricEnrolled){
            return Alert.alert('Login', 'Nenhuma biometria encontrada. Por favor, cadastre no dispositivo')
        }

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login com Biometria',
            fallbackLabel: 'Não foi possível reconhecer a biometria'
        });

        setIsAuthenticated(auth.success);
    }

    useEffect(() => {
        verifyAvaiableAuthentication();
    }, [])

    return(
        <S.Container>
            <S.Label>
                Usuário conectado: {isAuthenticated ? 'Sim' : 'Não'}
            </S.Label>

            <S.Button onPress={handleAuthentication}>
                <S.LabelButton>Entrar</S.LabelButton>
            </S.Button>
        </S.Container>
    )
}