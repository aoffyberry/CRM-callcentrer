import { GoogleGenAI } from "@google/genai";
import { Customer } from "../types";

// NOTE: Ideally, the API Key should be securely managed.
// For this frontend-only demo, we assume it's in env or user provides it.
// We will use a safe checking mechanism in the UI.

export const generateFollowUpScript = async (customer: Customer): Promise<string> => {
  const apiKey = process.env.API_KEY; 
  
  if (!apiKey) {
    return "ไม่พบ API Key กรุณาตั้งค่า API Key เพื่อใช้งานฟีเจอร์ AI";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Using gemini-2.5-flash for speed/efficiency in a simple text task
    const model = "gemini-2.5-flash"; 
    
    const prompt = `
      คุณเป็นพนักงานขายของคลินิกความงามที่มีความเป็นมืออาชีพและเป็นกันเอง
      ช่วยร่างข้อความสั้นๆ เพื่อติดตามลูกค้าทาง LINE หรือโทรศัพท์
      
      ข้อมูลลูกค้า:
      ชื่อ: ${customer.name}
      ทำทรีตเม้นท์ล่าสุด: ${customer.lastTreatment}
      วันที่ทำ: ${customer.serviceDate}
      
      โจทย์: ถามไถ่อาการหลังทำ เชิญชวนกลับมาใช้บริการซ้ำ หรือเสนอโปรโมชั่นที่เกี่ยวข้องกับทรีตเม้นท์เดิม
      ความยาว: ไม่เกิน 3-4 ประโยค
      โทนเสียง: สุภาพ, ใส่ใจ, ไม่ขายของหนักเกินไป
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "ขออภัย ไม่สามารถสร้างข้อความได้ในขณะนี้";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI";
  }
};