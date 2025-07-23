import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/react';
import { InternshipReviewForm } from '../stories/Feedback/InternshipReviewForm';
import './ReviewPage.css';

const ReviewPage: React.FC = () => {
  const handleSubmitSuccess = (reviewData: any) => {
    console.log('Review submitted successfully:', reviewData);
    // Here you could add navigation to a success page or show additional UI feedback
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab3" />
          </IonButtons>
          <IonTitle>インターンシップレビュー</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="review-page-container">
          <InternshipReviewForm
            onSubmitSuccess={handleSubmitSuccess}
            width="100%"
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ReviewPage;