import { ticketModel } from "../models/ticket.model.js";

class TicketsDao {

    async findTicket(purchaser) {
        const response = await ticketModel.find({purchaser}); 
        return response; 
    }

    async createTicket(ticket) {
        const response = await ticketModel.create(ticket); 
        return response; 
    }
}

export const ticketsDao = new TicketsDao();