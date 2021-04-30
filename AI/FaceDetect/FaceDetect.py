import os
import face_recognition
import numpy as np


# 定位面部框
# 返回一个数组[(y1,x2,y2,x1),....],(x1,y1)，(x2,y2)为其左上，右下点
def FaceDetection(filename):
    img = face_recognition.load_image_file(filename)
    face_locations = face_recognition.face_locations(img)
    return face_locations


# 人脸识别
# 将要识别的人脸数据集放在face_data_path下
# known_face_locations为上一步检测出的识别框，可以不填
# 返回一个数组[name1,....]分别为上一步识别出的识别框对应的人脸图片名
def FaceRecognition(filename, face_data_path, known_face_locations=None):
    # 制作所有可用图像的列表
    images = os.listdir(face_data_path)
    # 加载图像
    image_to_be_matched = face_recognition.load_image_file(filename)
    # 将加载图像编码为特征向量，有多个
    image_codes = face_recognition.face_encodings(image_to_be_matched, known_face_locations)
    # 对应识别框的识别结果
    names = []
    for i in range(len(image_codes)):
        names.append("Not matched")
    # 遍历每张图像
    for image in images:
        # 加载图像
        current_image = face_recognition.load_image_file(face_data_path + "/" + image.__str__())
        # 将加载图像编码为特征向量
        cur_img_code = face_recognition.face_encodings(current_image)[0]
        # 将你的图像和图像对比，看是否为同一人
        compare_results = face_recognition.compare_faces(image_codes, cur_img_code)
        for i in range(len(image_codes)):
            if compare_results[i]:
                names[i] = image
    return names


# 为face_data_path下的所有图片制作编码数据集，放在face_code_path路径中
# 命名方式为imagename+".npy"
def MakeCodeForFaceData(face_data_path, face_code_path):
    # 制作所有可用图像的列表
    images = os.listdir(face_data_path)
    # 遍历每张图像
    for image in images:
        # 加载图像
        current_image = face_recognition.load_image_file(face_data_path + "/" + image)
        # 将加载图像编码为特征向量
        cur_img_code = face_recognition.face_encodings(current_image)[0]
        # 存储到文件中
        np.save(face_code_path+"/"+image+".npy",cur_img_code)

# 人脸识别
# 将要识别的人脸编码数据集放在face_code_path下
# known_face_locations为上一步检测出的识别框，可以不填
# 返回一个数组[name1,....]分别为上一步识别出的识别框对应的人脸图片名
def FaceRecognitionWithPreprocCode(filename, face_code_path, known_face_locations=None):
    # 制作所有可用编码的列表
    face_codes = os.listdir(face_code_path)
    # 加载图像
    image_to_be_matched = face_recognition.load_image_file(filename)
    # 将加载图像编码为特征向量，有多个
    image_codes = face_recognition.face_encodings(image_to_be_matched, known_face_locations)
    # 对应识别框的识别结果
    names = []
    for i in range(len(image_codes)):
        names.append("Not matched")
    # 遍历每张图像
    for face_code in face_codes:
        # 加载特征向量
        cur_img_code = np.load(face_code_path + "/" + face_code)
        # 将你的图像和图像对比，看是否为同一人
        compare_results = face_recognition.compare_faces(image_codes, cur_img_code)
        for i in range(len(image_codes)):
            if compare_results[i]:
                names[i] = face_code.split(".npy")[0]

    return names


