import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 70,
        justifyContent: 'flex-start', // ใช้ 'flex-start' แทน 'top'
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    Slide: {
        fontSize: 60,
        color: '#60B876',
        fontWeight: 'bold',
        textAlign: 'center',
        // lineHeight: 50, // กำหนดความสูงของบรรทัดให้เท่ากับขนาดฟอนต์
    },

    ME: {
        fontSize: 110,
        color: '#60B876',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 100, // Set line height if needed
        zIndex: 99,
    },

    BorderContainer: {
        width: 350,                // ความกว้างของเส้นขอบ
        height: 650,               // ความสูงของเส้นขอบ
        // borderWidth: 2,            // ความหนาของเส้นขอบ
        // borderColor: '#60B876',    // สีของเส้นขอบ
        borderRadius: 10,          // มุมโค้งของเส้นขอบ
        padding: 10,               // ระยะห่างด้านในจากขอบถึงเนื้อหา
        alignItems: 'center',       // จัดแนวเนื้อหาภายใน Border
    },
    BorderText: {
        width: 200,                // ความกว้างของเส้นขอบ
        height: 200,               // ความสูงของเส้นขอบ
        // borderWidth: 2,            // ความหนาของเส้นขอบ
        // borderColor: '#60B876',    // สีของเส้นขอบ
        borderRadius: 10,          // มุมโค้งของเส้นขอบ
        padding: 10,               // ระยะห่างด้านในจากขอบถึงเนื้อหา
        alignItems: 'center',       // จัดแนวเนื้อหาภายใน Border
    },
    buttonContainer: {
        marginTop: 80,
        width: 325,                // ความกว้างของปุ่ม
        height: 100,                // ความสูงของปุ่ม
        // alignItems: 'center',       // จัดแนวเนื้อหาภายในปุ่ม
    },
    button: {
        backgroundColor: 'transparent', // ใช้พื้นหลังโปร่งใส
        borderColor: '#60B876',         // สีกรอบของปุ่ม
        borderWidth: 2,                 // ความหนาของกรอบ
        padding: 10,                    // ระยะห่างภายในของปุ่ม
        borderRadius: 10,               // มุมโค้งของปุ่ม
        marginTop: 20,                  // ระยะห่างด้านบน
    },
    buttonHovered: {
        backgroundColor: '#60B876', // เปลี่ยนสีพื้นหลังเมื่อ hover
    },
    buttonText: {
        color: '#60B876',            // สีตัวอักษรของปุ่ม
        fontSize: 16,                // ขนาดตัวอักษรของปุ่ม
        textAlign: 'center',         // จัดแนวตัวอักษรกลาง
    },
    icon: {
        marginLeft: 0,
        width: 24, // Set desired width
        height: 24, // Set desired height
        marginRight: 10, // Space between icon and text
    },
});
