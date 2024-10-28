import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: 30,
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
        width: "100%",
        height: 650,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    BorderText: {
        // width: 200,
        // height: 200,
        // backgroundColor:"red",
        padding: 10,
        alignItems: 'center',
    },
    buttonContainer: {
        borderWidth: 2,
        borderColor: '#60B876',
        borderRadius: 40,
        width: "100%",
        height: "100%",
        justifyContent: 'flex-start',
        backgroundColor: '#60B876',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 8,
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
    buttonText: {
        fontWeight: 'bold',
        color: '#ffffff',
        fontSize: 20,
        textAlign: 'center',
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
    topLeftBackButton: { 
        position: 'absolute', 
        top: 10, // Align to the top edge
        left: 0, // Align to the left edge
        padding: 10,
        zIndex: 1,
    },
});
