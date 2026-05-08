import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
export function getGrowthStage(progressPercent) {
    if (progressPercent >= 100) return 'Ready';
    if (progressPercent >= 75)  return 'Fruiting';
    if (progressPercent >= 50)  return 'Flowering';
    if (progressPercent >= 25)  return 'Vegetative';
    return 'Seedling';
}


export function getGrowthStageClass(stage) {
    const map = {
        'Seedling':   'stage-seedling',
        'Vegetative': 'stage-vegetative',
        'Flowering':  'stage-flowering',
        'Fruiting':   'stage-fruiting',
        'Ready':      'stage-ready',
    };
    return map[stage] || 'stage-seedling';
}


export function calculateProgress(plantingDateStr, daysToMaturity) {
    const plantingDate = new Date(plantingDateStr);
    const today = new Date();
    const daysSincePlanting = Math.floor((today - plantingDate) / (1000 * 60 * 60 * 24));
    const progressPercent = Math.min(Math.round((daysSincePlanting / daysToMaturity) * 100), 100);
    const daysRemaining = Math.max(daysToMaturity - daysSincePlanting, 0);

    const harvestDate = new Date(plantingDate);
    harvestDate.setDate(harvestDate.getDate() + daysToMaturity);

    return { progressPercent, daysRemaining, harvestDate };
}


export function formatDateBritish(date) {
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}


export async function addCrop(userId, cropData) {
    const cropsRef = collection(db, 'crops');
    const docRef = await addDoc(cropsRef, {
        userId,
        name:            cropData.name,
        plantingDate:    cropData.plantingDate,   
        daysToMaturity:  cropData.daysToMaturity, 
        soilType:        cropData.soilType,
        phLevel:         cropData.phLevel,
        waterPerWeek:    cropData.waterPerWeek,
        minTemp:         cropData.minTemp,
        maxTemp:         cropData.maxTemp,
        createdAt:       serverTimestamp()
    });
    return docRef.id;
}


export async function getUserCrops(userId) {
    const cropsRef = collection(db, 'crops');
    const q = query(
        cropsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}


export async function deleteCrop(cropId) {
    const cropRef = doc(db, 'crops', cropId);
    await deleteDoc(cropRef);
}
