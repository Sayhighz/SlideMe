  import React, { useState, useEffect } from 'react';
  import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet,
    Dimensions,
  } from 'react-native';
  import tw from 'twrnc';

  // Import components
  import AuthHeader from '../../components/auth/AuthHeader';
  import AuthButton from '../../components/auth/AuthButton';

  // Import services and constants
  import { FONTS, COLORS, MESSAGES } from '../../constants';

  const RegisterTrainingScreen = ({ navigation, route }) => {
    const {
      phoneNumber,
      selectedProvince,
      selectedVehicleType,
      firstName,
      lastName,
      idNumber,
      birthDate,
      idExpiryDate,
      licensePlate,
    } = route.params || {};

    
    const [currentModule, setCurrentModule] = useState(0);
    const [videoCompleted, setVideoCompleted] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      // เพิ่ม log เพื่อตรวจสอบข้อมูลที่รับมา
      console.log("Received data:", { 
        phoneNumber, selectedProvince, selectedVehicleType, 
        firstName, lastName, idNumber, birthDate, idExpiryDate, licensePlate 
      });
    }, []);

    // ข้อมูลการอบรม
    const trainingModules = [
      {
        id: 1,
        title: 'ความปลอดภัยบนท้องถนน',
        duration: '15 นาที',
        videoUrl: 'https://example.com/safety-video',
        // thumbnail: require('../../assets/images/safety-thumb.png'),
        description: 'เรียนรู้เกี่ยวกับกฎจราจรและการขับขี่อย่างปลอดภัยบนท้องถนน',
      },
      {
        id: 2,
        title: 'การบริการลูกค้า',
        duration: '12 นาที',
        videoUrl: 'https://example.com/customer-service-video',
        // thumbnail: require('../../assets/images/customer-thumb.png'),
        description: 'เทคนิคการให้บริการลูกค้าอย่างมืออาชีพและการสร้างความประทับใจ',
      },
      {
        id: 3,
        title: 'การใช้งานแอปพลิเคชัน',
        duration: '10 นาที',
        videoUrl: 'https://example.com/app-usage-video',
        // thumbnail: require('../../assets/images/app-thumb.png'),
        description: 'วิธีการใช้งานแอปพลิเคชันสำหรับคนขับอย่างมีประสิทธิภาพ',
      },
    ];

    // ข้อมูลแบบทดสอบ
    const quizQuestions = [
      {
        id: 1,
        question: 'ข้อใดไม่ใช่สิ่งที่ควรปฏิบัติเมื่อขับรถในเวลากลางคืน?',
        options: [
          'เปิดไฟหน้ารถเสมอ', 
          'ลดความเร็วลง', 
          'ใช้โทรศัพท์มือถือเพื่อนำทาง', 
          'ตรวจสอบไฟส่องสว่างให้พร้อมใช้งาน'
        ],
        correctAnswer: 2
      },
      {
        id: 2,
        question: 'เมื่อลูกค้าไม่พอใจการบริการ คุณควรทำอย่างไร?',
        options: [
          'พยายามแก้ไขปัญหาและรับฟังความคิดเห็น', 
          'แจ้งให้ลูกค้าติดต่อฝ่ายบริการลูกค้า', 
          'เพิกเฉยและขับรถต่อไป', 
          'โต้เถียงกับลูกค้าว่าคุณถูกต้อง'
        ],
        correctAnswer: 0
      },
      {
        id: 3,
        question: 'หากแอปพลิเคชันมีปัญหาระหว่างให้บริการ คุณควรทำอย่างไร?',
        options: [
          'ยกเลิกการให้บริการทันที', 
          'ติดต่อฝ่ายสนับสนุนและแจ้งให้ลูกค้าทราบ', 
          'เรียกเก็บเงินเพิ่มเติมจากลูกค้า', 
          'ปล่อยให้ลูกค้าแก้ปัญหาเอง'
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: 'ระยะเวลาที่เหมาะสมในการตรวจสอบสภาพรถยนต์คือเมื่อใด?',
        options: [
          'เดือนละครั้ง', 
          'ปีละครั้ง', 
          'ทุกครั้งก่อนออกให้บริการ', 
          'เมื่อพบปัญหาเท่านั้น'
        ],
        correctAnswer: 2
      },
      {
        id: 5,
        question: 'การสร้างความประทับใจให้กับลูกค้าข้อใดสำคัญที่สุด?',
        options: [
          'การสนทนาตลอดการเดินทาง', 
          'การให้บริการด้วยความสุภาพ ตรงเวลา และปลอดภัย', 
          'การให้น้ำดื่มฟรี', 
          'การเปิดเพลงที่ลูกค้าชอบ'
        ],
        correctAnswer: 1
      },
    ];

    // ตรวจสอบคำตอบแบบทดสอบ
    const checkAnswers = () => {
      let correctCount = 0;
      let totalQuestions = quizQuestions.length;
    
      quizQuestions.forEach(question => {
        if (quizAnswers[question.id] === question.correctAnswer) {
          correctCount++;
        }
      });
    
      const percentageCorrect = (correctCount / totalQuestions) * 100;
    
      if (percentageCorrect >= 80) {
        Alert.alert(
          "การทดสอบเสร็จสิ้น",
          `คุณได้ ${correctCount} คะแนน จาก ${totalQuestions} ข้อ (${percentageCorrect}%)\n\nยินดีด้วย! คุณผ่านการอบรมแล้ว`,
          [
            { 
              text: "เสร็จสิ้น", 
              onPress: () => navigation.navigate('RegisterUpload', {  phoneNumber,
                selectedProvince,
                selectedVehicleType,
                firstName,
                lastName,
                idNumber,
                birthDate,
                idExpiryDate,
                licensePlate, 
                trainingScore: percentageCorrect }) // Navigating to RegisterUploadScreen
            }
          ]
        );
      } else {
        Alert.alert(
          "การทดสอบเสร็จสิ้น",
          `คุณได้ ${correctCount} คะแนน จาก ${totalQuestions} ข้อ (${percentageCorrect}%)\n\nคุณต้องได้อย่างน้อย 80% เพื่อผ่านการอบรม กรุณาทบทวนบทเรียนและทำแบบทดสอบอีกครั้ง`,
          [
            { text: "ทบทวนบทเรียน", onPress: () => {
              setQuizStarted(false);
              setQuizAnswers({});
              setVideoCompleted(false);
            }}
          ]
        );
      }
    };
    

    const handleSelectAnswer = (questionId, answerIndex) => {
      setQuizAnswers({
        ...quizAnswers,
        [questionId]: answerIndex
      });
    };

    const handleWatchVideo = () => {
      // จำลองการดูวิดีโอ
      Alert.alert(
        "กำลังเปิดวิดีโอ",
        `กำลังเล่นวิดีโอ ${trainingModules[currentModule].title}`,
        [
          { text: "สมมุติว่าดูจบแล้ว", onPress: () => setVideoCompleted(true) }
        ]
      );
    };

    const handleSubmitQuiz = () => {
      const answeredCount = Object.keys(quizAnswers).length;
      if (answeredCount < quizQuestions.length) {
        Alert.alert("กรุณาตอบคำถามให้ครบทุกข้อ", `คุณตอบไปแล้ว ${answeredCount} จาก ${quizQuestions.length} ข้อ`);
        return;
      }
      
      checkAnswers();
    };

    const handleNext = () => {
      if (currentModule < trainingModules.length - 1) {
        setCurrentModule(currentModule + 1);
        setVideoCompleted(false);
      } else {
        setQuizStarted(true);
      }
    };

    const handlePrevious = () => {
      if (currentModule > 0) {
        setCurrentModule(currentModule - 1);
        setVideoCompleted(false);
      }
    };

    // แสดงข้อมูลการอบรม
    const renderTrainingContent = () => {
      const module = trainingModules[currentModule];
      
      return (
        <View style={tw`mb-6`}>
          <Text style={[tw`text-xl font-bold mb-2 text-gray-800`, { fontFamily: FONTS.FAMILY.BOLD }]}>
            {module.title}
          </Text>
          
          <TouchableOpacity 
            style={tw`mb-4 rounded-lg overflow-hidden`} 
            onPress={handleWatchVideo}
          >
            <View style={tw`bg-gray-200 h-48 items-center justify-center`}>
              <Text style={tw`text-lg text-gray-500`}>รูปภาพ Thumbnail</Text>
              <View style={tw`absolute inset-0 items-center justify-center`}>
                <View style={tw`bg-black bg-opacity-50 rounded-full p-4`}>
                  <Text style={tw`text-white text-4xl`}>▶</Text>
                </View>
              </View>
            </View>
            
            <View style={tw`bg-gray-100 p-3 flex-row items-center justify-between`}>
              <Text style={tw`text-gray-800`}>ความยาว: {module.duration}</Text>
              {videoCompleted ? (
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-green-600 mr-1`}>รับชมแล้ว</Text>
                  <Text style={tw`text-green-600`}>✓</Text>
                </View>
              ) : (
                <Text style={tw`text-blue-500`}>กดเพื่อรับชม</Text>
              )}
            </View>
          </TouchableOpacity>
          
          <Text style={tw`text-gray-700 mb-4`}>
            {module.description}
          </Text>
          
          <View style={tw`flex-row justify-between mt-4`}>
            <TouchableOpacity 
              style={[tw`px-4 py-2 rounded-lg`, currentModule === 0 ? tw`bg-gray-300` : tw`bg-gray-500`]}
              onPress={handlePrevious}
              disabled={currentModule === 0}
            >
              <Text style={tw`text-white font-bold`}>◀ ก่อนหน้า</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[tw`px-4 py-2 rounded-lg`, videoCompleted ? tw`bg-blue-500` : tw`bg-gray-300`]}
              onPress={handleNext}
              disabled={!videoCompleted}
            >
              <Text style={tw`text-white font-bold`}>ถัดไป ▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    // แสดงแบบทดสอบ
    const renderQuiz = () => {
      return (
        <View style={tw`mb-6`}>
          <View style={{
            ...tw`border-l-4 border-[${COLORS.PRIMARY}] pl-3 mb-6`,
          }}>
            <Text style={{
              fontFamily: FONTS.FAMILY.BOLD,
              fontSize: FONTS.SIZE.XL,
              ...tw`text-gray-800`,
            }}>
              แบบทดสอบหลังการอบรม
            </Text>
            <Text style={tw`mt-2 text-gray-600`}>
              จำเป็นต้องได้คะแนนอย่างน้อย 80% เพื่อผ่านการอบรม
            </Text>
          </View>
          
          {quizQuestions.map((question, index) => (
            <View key={question.id} style={tw`mb-8 pb-6 border-b border-gray-200`}>
              <Text style={tw`text-lg font-bold mb-3`}>
                {index + 1}. {question.question}
              </Text>
              
              {question.options.map((option, optionIndex) => (
                <TouchableOpacity 
                  key={optionIndex}
                  style={[
                    tw`p-3 mb-2 rounded-lg border`,
                    quizAnswers[question.id] === optionIndex 
                      ? tw`bg-blue-100 border-blue-500` 
                      : tw`bg-white border-gray-300`
                  ]}
                  onPress={() => handleSelectAnswer(question.id, optionIndex)}
                >
                  <Text style={tw`text-gray-800`}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          
          <AuthButton
            title="ส่งคำตอบ"
            onPress={handleSubmitQuiz}
            isLoading={isLoading}
          />
        </View>
      );
    };

    return (
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <AuthHeader
          title={quizStarted ? "แบบทดสอบ" : `การอบรม (${currentModule + 1}/${trainingModules.length})`}
          onBack={() => {
            if (quizStarted) {
              Alert.alert(
                "ยืนยันการออก",
                "คุณแน่ใจหรือไม่ว่าต้องการออกจากแบบทดสอบ? คำตอบทั้งหมดจะถูกยกเลิก",
                [
                  { text: "ยกเลิก", style: "cancel" },
                  { text: "ออก", onPress: () => {
                    setQuizStarted(false);
                    setQuizAnswers({});
                  }}
                ]
              );
            } else {
              navigation.goBack();
            }
          }}
        />
        
        <ScrollView 
          contentContainerStyle={tw`p-6`}
          showsVerticalScrollIndicator={false}
        >
          {!quizStarted ? (
            <>
              <View style={tw`mb-6`}>
                <View style={{
                  ...tw`border-l-4 border-[${COLORS.PRIMARY}] pl-3 mb-6`,
                }}>
                  <Text style={{
                    fontFamily: FONTS.FAMILY.BOLD,
                    fontSize: FONTS.SIZE.XL,
                    ...tw`text-gray-800`,
                  }}>
                    การอบรมคนขับ
                  </Text>
                  <Text style={tw`mt-2 text-gray-600`}>
                    รับชมวิดีโอทั้งหมด 3 บทเรียน และทำแบบทดสอบ
                  </Text>
                </View>
              </View>
              
              <View style={tw`flex-row mb-6`}>
                {trainingModules.map((module, index) => (
                  <View 
                    key={module.id} 
                    style={[
                      tw`flex-1 items-center`,
                      index < trainingModules.length - 1 && tw`border-r border-gray-300`
                    ]}
                  >
                    <View style={[
                      tw`w-10 h-10 rounded-full items-center justify-center mb-2`,
                      index < currentModule || (index === currentModule && videoCompleted) 
                        ? tw`bg-green-500` 
                        : index === currentModule 
                          ? tw`bg-blue-500` 
                          : tw`bg-gray-300`
                    ]}>
                      <Text style={tw`text-white font-bold`}>{index + 1}</Text>
                    </View>
                    <Text style={tw`text-xs text-center text-gray-600`}>
                      {module.title.length > 15 ? module.title.substring(0, 15) + '...' : module.title}
                    </Text>
                  </View>
                ))}
                <View style={tw`flex-1 items-center`}>
                  <View style={[
                    tw`w-10 h-10 rounded-full items-center justify-center mb-2`,
                    quizStarted ? tw`bg-blue-500` : tw`bg-gray-300`
                  ]}>
                    <Text style={tw`text-white font-bold`}>4</Text>
                  </View>
                  <Text style={tw`text-xs text-center text-gray-600`}>
                    แบบทดสอบ
                  </Text>
                </View>
              </View>
              
              {renderTrainingContent()}
            </>
          ) : (
            renderQuiz()
          )}
        </ScrollView>
      </SafeAreaView>
    );
  };

  export default RegisterTrainingScreen;