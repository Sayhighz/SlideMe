import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './LoginpageStyle';
import SignupPage from '../SignupPage/SignupPage';

function Loginpage() {
    const [showMainContent, setShowMainContent] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const handleNext = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setShowMainContent(false);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleBack = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setShowMainContent(true);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        });
    };

    return (
        <SafeAreaView>

        <View style={styles.container}>
            <View style={styles.BorderContainer}>
                {/* Show back button in top-left only when SignupPage is active */}
                {!showMainContent && (
                    <TouchableOpacity style={styles.topLeftBackButton} onPress={handleBack}>
                        <Icon name="arrow-left" size={20} color="#000" />
                    </TouchableOpacity>
                )}

                <View style={styles.BorderText}>
                    <Text style={styles.Slide}>SLIDE</Text>
                    <Text style={styles.ME}>ME</Text>
                </View>

                <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
                    {showMainContent ? (
                        <View style={styles.textAboveButtonContainer}>
                            <Text style={styles.textAboveButton}>เรียกรถสไลด์ได้ง่าย ๆ ในไม่กี่คลิก!</Text>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleNext}
                                >
                                <Text style={styles.buttonText}>เริ่มต้นใช้งาน</Text>
                            </TouchableOpacity>
                            <Text style={styles.Support}>ข้อมูลติดต่อ/ช่วยเหลือ</Text>
                        </View>
                    ) : (
                        <SignupPage onBack={handleBack} />
                    )}
                </Animated.View>
            </View>
        </View>
                    </SafeAreaView>
    );
}

export default Loginpage;
