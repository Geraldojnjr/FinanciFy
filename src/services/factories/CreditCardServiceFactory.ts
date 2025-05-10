import { ICreditCardService } from "../interfaces/ICreditCardService";
import { MariaDBCreditCardService } from "../implementations/MariaDBCreditCardService";
import { SupabaseCreditCardService } from "../implementations/SupabaseCreditCardService";
import { MariaDBClient } from "@/lib/types";
import { isUsingSupabase } from "@/config/database";

export class CreditCardServiceFactory {
  static create(client: MariaDBClient): ICreditCardService {
    if (isUsingSupabase()) {
      return new SupabaseCreditCardService();
    }
    return new MariaDBCreditCardService(client);
  }
} 