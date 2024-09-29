from flask import Flask, jsonify
import pickle
import cv2
import mediapipe as mp
import numpy as np
import time

app = Flask(__name__)


@app.route('/get-query', methods=['GET'])
def get_query():
    try:
        with open('./model.p', 'rb') as f:
            model_dict = pickle.load(f)
        model = model_dict['model']
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
        exit()
    


    # Initialize Video Capture (try different indices if 0 doesn't work)
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open the camera.")
        exit()

    print("Camera opened successfully. Starting prediction. Press 'q' to quit.")

    # Initialize MediaPipe Hands
    mp_hands = mp.solutions.hands
    mp_drawing = mp.solutions.drawing_utils
    mp_drawing_styles = mp.solutions.drawing_styles

    hands = mp_hands.Hands(
        static_image_mode=False,  # Optimized for video
        max_num_hands=1,          # Process one hand at a time
        min_detection_confidence=0.3
    )

    # Define label dictionary for predicted gestures
    labels_dict = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E',
              5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J',
              10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O',
              15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T',
              20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y',
              25: 'Z', 26: 'q', 27: ' '}

    statement = ""  # This will hold the string of detected gestures
    last_predicted_character = None  # To track the last gesture to detect changes

    while True:
        ret, frame = cap.read()

        if not ret:
            print("Error: Failed to capture image.")
            break

        # Get frame dimensions
        H, W, _ = frame.shape

        # Convert the BGR image to RGB (MediaPipe processes RGB)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process the frame and detect hands
        results = hands.process(frame_rgb)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Draw hand landmarks on the frame
                mp_drawing.draw_landmarks(
                    frame,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style()
                )

                # Initialize lists to hold normalized coordinates
                data_aux = []
                x_coords = []
                y_coords = []

                # Extract x and y coordinates for all landmarks
                for landmark in hand_landmarks.landmark:
                    x_coords.append(landmark.x)
                    y_coords.append(landmark.y)

                # Calculate minimum x and y for normalization
                min_x = min(x_coords) if x_coords else 0
                min_y = min(y_coords) if y_coords else 0

                # Normalize and append coordinates to data_aux
                for x, y in zip(x_coords, y_coords):
                    normalized_x = x - min_x
                    normalized_y = y - min_y
                    data_aux.append(normalized_x)
                    data_aux.append(normalized_y)

                # Ensure exactly 42 features (21 landmarks * 2)
                if len(data_aux) == 42:
                    try:
                        # Predict the gesture using the model
                        prediction = model.predict([np.asarray(data_aux)])
                        predicted_character = labels_dict.get(int(prediction[0]), 'Unknown')
                        
                        if predicted_character == 'q' :
                            return jsonify({"query": statement}) 

                        # Only append if the gesture has changed
                        if predicted_character != last_predicted_character:
                            statement += predicted_character  # Add to statement
                            last_predicted_character = predicted_character  # Update last gesture
                            print(f"Predicted character: {predicted_character}")
                            print(f"***** ALERT: Given String: {statement} *****")

                    except Exception as e:
                        print(f"Prediction error: {e}")
                        predicted_character = 'Error'

                    # Calculate bounding box for annotation
                    x1 = int(min(x_coords) * W) - 10
                    y1 = int(min(y_coords) * H) - 10
                    x2 = int(max(x_coords) * W) + 10
                    y2 = int(max(y_coords) * H) + 10

                    # Draw rectangle and predicted character on the frame
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 0), 4)
                    cv2.putText(frame, predicted_character, (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 0, 0), 3, cv2.LINE_AA)
                else:
                    print(f"Skipping prediction: Expected 42 features, got {len(data_aux)}.")

        # Display the frame with hand landmarks and gesture annotations
        cv2.imshow('frame', frame)

        # Exit the loop when 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("Exiting prediction loop.")
            break
    return jsonify({"query": statement})
    # Release the video capture and close windows
    cap.release()
    cv2.destroyAllWindows()
