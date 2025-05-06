import Image from "next/image"
import { Building2 } from "lucide-react"

interface MinimalTemplateProps {
  companyName: string;
  logo: string | null;
  primaryColor: string;
  showOrderLineImages: boolean;
}

export function MinimalTemplate({
  companyName,
  logo,
  primaryColor,
  showOrderLineImages,
}: MinimalTemplateProps) {
  return (
    <div className="max-w-[500px] bg-white mx-auto border rounded-lg overflow-hidden shadow-sm p-8" >
      {/* Invoice Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {logo ? (
              <div className="h-8 w-auto">
                <Image
                  src={logo}
                  alt="Company Logo"
                  width={180}
                  height={80}
                  className="h-full w-auto object-contain"
                />
              </div>
            ) : (
              <div className="h-8 w-8 flex items-center justify-center rounded-full" style={{ backgroundColor: primaryColor }}>
                <Building2 className="h-4 w-4 text-white" />
              </div>
            )}
            <h2 className="text-lg font-medium">{companyName}</h2>
          </div>
          <div>
            <p className="text-sm text-right font-medium">Invoice #INV-2023-001</p>
          </div>
        </div>
      </div>

      {/* Dates and Client Info */}
      <div className="flex justify-between mb-8">
        <div>
          <p className="text-xs text-muted-foreground mb-1">BILLED TO</p>
          <p className="text-sm font-medium">Client Name</p>
          <p className="text-xs text-muted-foreground">client@email.com</p>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <p className="text-xs text-muted-foreground">ISSUED</p>
            <p className="text-sm">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">DUE</p>
            <p className="text-sm">{new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-200 mb-6"></div>

      {/* Invoice Items */}
      <div className="mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {showOrderLineImages && <th className="text-left pb-3 font-medium text-xs text-muted-foreground w-12">IMAGE</th>}
              <th className="text-left pb-3 font-medium text-xs text-muted-foreground">DESCRIPTION</th>
              <th className="text-right pb-3 font-medium text-xs text-muted-foreground">QTY</th>
              <th className="text-right pb-3 font-medium text-xs text-muted-foreground">PRICE</th>
              <th className="text-right pb-3 font-medium text-xs text-muted-foreground">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              {showOrderLineImages && (
                <td className="py-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                </td>
              )}
              <td className="py-3">Service Item 1</td>
              <td className="text-right py-3">1</td>
              <td className="text-right py-3">$100.00</td>
              <td className="text-right py-3 font-medium">$100.00</td>
            </tr>
            <tr className="border-b border-gray-100">
              {showOrderLineImages && (
                <td className="py-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                </td>
              )}
              <td className="py-3">Service Item 2</td>
              <td className="text-right py-3">2</td>
              <td className="text-right py-3">$75.00</td>
              <td className="text-right py-3 font-medium">$150.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-1/2">
          <div className="flex justify-between py-1 text-sm">
            <span>Subtotal</span>
            <span>$250.00</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span>Tax (10%)</span>
            <span>$25.00</span>
          </div>
          <div className="flex justify-between py-2 text-base font-medium border-t mt-2">
            <span>Total</span>
            <span style={{ color: primaryColor }}>$275.00</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t">
        <p>Thank you for your business!</p>
        <p className="mt-1">Payment is due within 30 days.</p>
      </div>
    </div>
  );
}
