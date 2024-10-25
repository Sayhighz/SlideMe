import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 70,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    Slide: {
        fontSize: 60,
        color: '#60B876',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    ME: {
        fontSize: 110,
        color: '#60B876',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 100,
        zIndex: 99,
    },
    BorderContainer: {
        width: 350,
        height: 650,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    BorderText: {
        width: 200,
        height: 200,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    buttonContainer: {
        borderWidth: 2,
        borderColor: '#60B876',
        borderRadius: 40,
        width: 380,
        height: 600,
        justifyContent: 'flex-start',
        backgroundColor: '#60B876',
        alignItems: 'center',
        shadowColor: '#000', // สีของเงา
        shadowOffset: {
            width: 0, // ระยะห่างของเงาในแนวนอน
            height: 4, // เพิ่มระยะห่างของเงาในแนวตั้ง
        },
        shadowOpacity: 0.6, // เพิ่มความเข้มของเงา
        shadowRadius: 10, // เพิ่มความนุ่มนวลของเงา
        elevation: 8, // เพิ่มระดับความสูงของเงา
    },
    button: {
        width: 325,
        backgroundColor: 'transparent',
        borderColor: '#ffffff',
        borderWidth: 2,
        padding: 10,
        borderRadius: 10,
        marginTop: 200,
    },
    buttonHovered: {
        backgroundColor: '#ffffff',
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#ffffff',
        fontSize: 20,
        textAlign: 'center',
    },
    icon: {
        marginLeft: 0,
        width: 24,
        height: 24,
        marginRight: 10,
    },
    textAboveButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    textAboveButton: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        fontFamily: 'Mitr-Medium',
    },
    Support: {
        marginTop: 5,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffffff',
        fontFamily: 'Mitr-Medium',
    },
});
