/**
 * SaveAI - Database Engine (Dexie.js-based Storage Layer)
 * 
 * Re-constructs IndexedDB persistent tables storing captured conversation list,
 * timestamps, target AI models, and page types.
 */

// Import raw Dexie (Dexie.js must be standard library dependency in package.json)
import Dexie from 'dexie';
import { generateRandomUid } from '../utils/uid.js';

export class ChatDatabase extends Dexie {
  constructor() {
    super("chatPreviewDB");
    
    // Schema migration history mappings matching bundled output versions
    this.version(1).stores({
      chatMessages: "id, lastUpdateAt"
    });
    
    this.version(2).stores({
      chatMessages: "id, lastUpdateAt, pageType, model"
    });
  }
}

export const chatDbInstance = new ChatDatabase();

/**
 * ChatStore - CRUD actions helper
 */
export class ChatStore {
  static generateId(data) {
    return data.pageId ? data.pageId : generateRandomUid();
  }

  static async getById(id) {
    if (!id) return;
    try {
      return await chatDbInstance.chatMessages.get(id);
    } catch (error) {
      console.error("Dexie getById failed:", error);
    }
  }

  static async save(data) {
    try {
      const id = this.generateId(data);
      const record = { ...data, id };
      const existing = await chatDbInstance.chatMessages.get(id);
      
      if (existing) {
        if (existing.createAt) record.createAt = existing.createAt;
        if (existing.title) record.title = existing.title;
      } else {
        if (!record.createAt) record.createAt = Date.now();
      }
      
      record.lastUpdateAt = Date.now();
      await chatDbInstance.chatMessages.put(record);
      return id;
    } catch (error) {
      console.error("Dexie save failed:", error);
      throw error;
    }
  }

  static async updateTitle(id, title, skipTimestampUpdate = false) {
    try {
      const updates = { title };
      if (!skipTimestampUpdate) {
        updates.lastUpdateAt = Date.now();
      }
      await chatDbInstance.chatMessages.update(id, updates);
    } catch (error) {
      console.error("Dexie updateTitle failed:", error);
      throw error;
    }
  }

  static async bulkUpdateLastUpdateAt(updatesArray) {
    try {
      if (updatesArray.length === 0) return;
      const ids = updatesArray.map(item => item.id);
      const records = await chatDbInstance.chatMessages.where("id").anyOf(ids).toArray();
      const updated = records.map(record => {
        const matchingUpdate = updatesArray.find(item => item.id === record.id);
        return matchingUpdate ? { ...record, lastUpdateAt: matchingUpdate.lastUpdateAt } : record;
      });
      await chatDbInstance.chatMessages.bulkPut(updated);
    } catch (error) {
      console.error("Dexie bulkUpdateLastUpdateAt failed:", error);
      throw error;
    }
  }

  static async deleteById(id) {
    try {
      await chatDbInstance.chatMessages.delete(id);
    } catch (error) {
      console.error("Dexie deleteById failed:", error);
      throw error;
    }
  }

  static async getAll() {
    try {
      return await chatDbInstance.chatMessages.orderBy("lastUpdateAt").reverse().toArray();
    } catch (error) {
      console.error("Dexie getAll failed:", error);
      return [];
    }
  }

  static async cleanExpiredMessages(retentionDays) {
    try {
      const now = Date.now();
      const retentionMs = retentionDays * 24 * 60 * 60 * 1000;
      const threshold = now - retentionMs;
      const allRecords = await chatDbInstance.chatMessages.toArray();
      const expiredIds = allRecords
        .filter(record => record.lastUpdateAt < threshold && record.pageType !== "singleChat")
        .map(record => record.id);

      if (expiredIds.length > 0) {
        await chatDbInstance.chatMessages.bulkDelete(expiredIds);
      }
      return expiredIds.length;
    } catch (error) {
      console.error("Dexie cleanExpiredMessages failed:", error);
      return 0;
    }
  }

  static async getAllByPageType(pageType) {
    try {
      const records = await chatDbInstance.chatMessages.where("pageType").equals(pageType).toArray();
      return records.sort((a, b) => b.lastUpdateAt - a.lastUpdateAt);
    } catch (error) {
      console.error("Dexie getAllByPageType failed:", error);
      return [];
    }
  }

  static async getAllByModel(model) {
    try {
      const records = await chatDbInstance.chatMessages.where("model").equals(model).toArray();
      return records.sort((a, b) => b.lastUpdateAt - a.lastUpdateAt);
    } catch (error) {
      console.error("Dexie getAllByModel failed:", error);
      return [];
    }
  }

  static async deleteByPageType(pageType) {
    try {
      const expiredIds = (await chatDbInstance.chatMessages.where("pageType").equals(pageType).toArray()).map(r => r.id);
      if (expiredIds.length > 0) {
        await chatDbInstance.chatMessages.bulkDelete(expiredIds);
      }
      return expiredIds.length;
    } catch (error) {
      console.error("Dexie deleteByPageType failed:", error);
      return 0;
    }
  }

  static matchKeyword(record, query) {
    if (!query || query.trim() === "") return true;
    const lowerQuery = query.toLowerCase().trim();
    if (record.title && record.title.toLowerCase().includes(lowerQuery)) return true;
    
    if (record.messages && record.messages.length > 0) {
      for (const msg of record.messages) {
        const text = this.getMessageTextSummary(msg, 10000);
        if (text.toLowerCase().includes(lowerQuery)) return true;
      }
    }
    return false;
  }

  static getMessageTextSummary(message, limit) {
    if (!message || !message.contents) return "";
    const text = message.contents
      .filter(c => c.type === "text" || c.type === "markdown" ? c.content : (c.type === "image" ? c.imageUrl : false))
      .map(c => c.type === "image" && c.imageUrl ? c.imageUrl.trim() : c.content.trim())
      .filter(val => val.length > 0)
      .join(" ");
    return text.length <= limit ? text : text.substring(0, limit) + "...";
  }

  static async searchByPageType(pageType, query = "", offset = 0, limit = 20) {
    try {
      let records = await chatDbInstance.chatMessages.where("pageType").equals(pageType).toArray();
      if (query && query.trim() !== "") {
        records = records.filter(record => this.matchKeyword(record, query));
      }
      records.sort((a, b) => b.lastUpdateAt - a.lastUpdateAt);
      const total = records.length;
      return {
        data: records.slice(offset, offset + limit),
        total
      };
    } catch (error) {
      console.error("Dexie searchByPageType failed:", error);
      return { data: [], total: 0 };
    }
  }

  static async countByPageType(pageType, query = "") {
    try {
      let records = await chatDbInstance.chatMessages.where("pageType").equals(pageType).toArray();
      if (query && query.trim() !== "") {
        records = records.filter(record => this.matchKeyword(record, query));
      }
      return records.length;
    } catch (error) {
      console.error("Dexie countByPageType failed:", error);
      return 0;
    }
  }
}
