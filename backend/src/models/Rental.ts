import mongoose, { Schema, Document } from 'mongoose';

export interface IRental extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  rentedAt: Date;
  dueAt: Date;
  returnedAt?: Date;
  status: 'active' | 'returned' | 'canceled';
  createdAt: Date;
  updatedAt: Date;
}

const RentalSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    rentedAt: { type: Date, default: Date.now },
    dueAt: { type: Date, required: true },
    returnedAt: { type: Date, default: null },
    status: { type: String, enum: ['active', 'returned', 'canceled'], default: 'active' },
  },
  { timestamps: true }
);

RentalSchema.index({ userId: 1 });
RentalSchema.index({ bookId: 1 });
RentalSchema.index({ status: 1 });

export default mongoose.model<IRental>('Rental', RentalSchema);
