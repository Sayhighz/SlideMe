import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './LoginpageStyle';

import facebook from '../../assets/LoginIcon/image.png';

function Loginpage() {
    const [hoveredButton, setHoveredButton] = useState(null); // ใช้ state สำหรับการ hover

    const handleLogin = () => {
        alert('Login Button Pressed!');
    };

    const handleSignup = () => {
        alert('Signup Button Pressed!');
    };

    const buttons = [
        { label: 'Continue With Facebook', onPress: handleLogin, icon: facebook },
        { label: 'Continue With Google', onPress: handleLogin },
        { label: 'Continue With Apple', onPress: handleLogin },
        { label: 'Continue With Mobile Number', onPress: handleSignup },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.BorderContainer}>
                <View style={styles.BorderText}>
                    <Text style={styles.Slide}>SLIDE</Text>
                    <Text style={styles.ME}>ME</Text>
                </View>
                <View style={styles.buttonContainer}>
                    {buttons.map((button, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.button,
                                hoveredButton === index ? styles.buttonHovered : null,
                            ]}
                            onPressIn={() => setHoveredButton(index)}
                            onPressOut={() => setHoveredButton(null)}
                            onPress={button.onPress}
                        >
                            {/* Add the Image component with the corresponding icon */}
                            <Image source={button.icon} style={styles.icon} />
                            <Text style={styles.buttonText}>{button.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

export default Loginpage;
