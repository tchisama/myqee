import Image from "next/image"
import { Building2 } from "lucide-react"

interface SpaceTemplateProps {
  companyName: string;
  logo: string | null;
  primaryColor: string;
  showOrderLineImages: boolean;
}

export function SpaceTemplate({
  companyName,
  logo,
  primaryColor,
  showOrderLineImages,
}: SpaceTemplateProps) {
  return (
    <div className=" max-w-[500px] bg-white mx-auto border rounded-lg overflow-hidden shadow-sm">
      {/* Invoice Header with space theme */}
      <div className="p-6 bg-gradient-to-br from-black to-gray-800 text-white relative overflow-hidden">
        {/* Space-themed decorative elements */}
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20">
          <div className="absolute h-2 w-2 rounded-full bg-white top-[10%] left-[20%] animate-pulse"></div>
          <div className="absolute h-1 w-1 rounded-full bg-white top-[30%] left-[80%] animate-pulse"></div>
          <div className="absolute h-1.5 w-1.5 rounded-full bg-white top-[70%] left-[10%] animate-pulse"></div>
          <div className="absolute h-1 w-1 rounded-full bg-white top-[50%] left-[40%] animate-pulse"></div>
          <div className="absolute h-2 w-2 rounded-full bg-white top-[20%] left-[60%] animate-pulse"></div>
        </div>

        <div className="flex justify-between items-start relative z-10">
          <div>
            {logo ? (
              <div className="h-12  w-auto mb-3">
                <Image
                  src={logo}
                  alt="Company Logo"
                  width={180}
                  height={80}
                  className="h-full w-auto object-contain"
                />
              </div>
            ) : (
              <div className="h-16 w-16 flex items-center justify-center rounded-full mb-3" style={{ backgroundColor: primaryColor }}>
                <Building2 className="h-8 w-8 text-white" />
              </div>
            )}
            <h1 className="text-xl font-bold">{companyName}</h1>
            <p className="text-sm text-white/70">Invoice #INV-2023-001</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">Date Issued</div>
            <div className="text-lg">June 15, 2023</div>
            <div className="mt-2 text-sm font-medium">Due Date</div>
            <div className="text-lg">June 30, 2023</div>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="p-6 border-b">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-2">Billed To</h2>
            <div className="text-sm">
              <div className="font-medium">Acme Corporation</div>
              <div>123 Business Avenue</div>
              <div>Suite 200</div>
              <div>San Francisco, CA 94107</div>
              <div>United States</div>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-2">Payment Details</h2>
            <div className="text-sm">
              <div><span className="font-medium">Payment Method:</span> Credit Card</div>
              <div><span className="font-medium">Card Type:</span> Visa ending in 4242</div>
              <div className="mt-2"><span className="font-medium">Email:</span> billing@acmecorp.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="p-6">
        <h2 className="text-sm font-medium mb-4" style={{ color: primaryColor }}>Invoice Items</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground pb-2 border-b">
            {showOrderLineImages && <div className="col-span-1 ">Image</div>}
            <div className={`${showOrderLineImages ? 'col-span-5' : 'col-span-6'}`}>Description</div>
            <div className="col-span-2 text-right">Quantity</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>

          {/* Item 1 */}
          <div className="grid grid-cols-12 text-sm py-2 border-b border-dashed">
            {showOrderLineImages && (
              <div className="col-span-1 pr-2 ">
                <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
              </div>
            )}
            <div className={`${showOrderLineImages ? 'col-span-5' : 'col-span-6'}`}>
              <div className="font-medium">Premium Subscription</div>
            </div>
            <div className="col-span-2 text-right">1</div>
            <div className="col-span-2 text-right">$99.00</div>
            <div className="col-span-2 text-right font-medium">$99.00</div>
          </div>

          {/* Item 2 */}
          <div className="grid grid-cols-12 text-sm py-2 border-b border-dashed">
            {showOrderLineImages && (
              <div className="col-span-1 pr-2">
                <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
              </div>
            )}
            <div className={`${showOrderLineImages ? 'col-span-5' : 'col-span-6'}`}>
              <div className="font-medium">Additional Users</div>
            </div>
            <div className="col-span-2 text-right">5</div>
            <div className="col-span-2 text-right">$20.00</div>
            <div className="col-span-2 text-right font-medium">$100.00</div>
          </div>
        </div>

        {/* Totals */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <div>Subtotal</div>
            <div>$199.00</div>
          </div>
          <div className="flex justify-between text-sm">
            <div>Tax (10%)</div>
            <div>$19.90</div>
          </div>
          <div className="flex justify-between font-medium text-base pt-2 border-t">
            <div>Total</div>
            <div style={{ color: primaryColor }}>$218.90</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gradient-to-br from-gray-900 to-black text-white text-center text-sm">
        <p>Thank you for your business!</p>
        <p className="mt-1 text-white/70">For questions about this invoice, please contact support@{companyName.toLowerCase()}.com</p>
      </div>
    </div>
  );
}
