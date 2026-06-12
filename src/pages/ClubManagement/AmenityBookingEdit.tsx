import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CheckCircle, FileText, Shield, ArrowLeft } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { fetchBookingDetails, FacilityBookingDetails } from '@/store/slices/facilityBookingsSlice';
import axios from 'axios';
import { toast } from 'sonner';

export const AmenityBookingEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booking, setBooking] = useState<FacilityBookingDetails | null>(null);

  // Per-unit rates derived from existing booking
  const [memberRate, setMemberRate] = useState(0);
  const [guestRate, setGuestRate] = useState(0);
  const [gstPercent, setGstPercent] = useState(0);
  const [sgstPercent, setSgstPercent] = useState(0);

  // Fixed values from booking (read-only)
  const [accessoryTotal, setAccessoryTotal] = useState(0);
  const [slotTotal, setSlotTotal] = useState(0);
  const [existingDiscount, setExistingDiscount] = useState(0);

  // Editable payload fields
  const [memberCount, setMemberCount] = useState(0);
  const [numberOfGuests, setNumberOfGuests] = useState(0);

  // ─── Same formula as Add page ─────────────────────────────────────────────
  const memberCharges = memberCount * memberRate;
  const guestCharges = numberOfGuests * guestRate;
  const subtotalBeforeDiscount = memberCharges + guestCharges + slotTotal + accessoryTotal;
  const discountAmount = existingDiscount;
  const subtotalAfterDiscount = subtotalBeforeDiscount - discountAmount;
  const gstAmount = (subtotalAfterDiscount * gstPercent) / 100;
  const sgstAmount = (subtotalAfterDiscount * sgstPercent) / 100;
  const grandTotal = subtotalAfterDiscount + gstAmount + sgstAmount;
  // ─────────────────────────────────────────────────────────────────────────

  const [openCancelPolicy, setOpenCancelPolicy] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await dispatch(fetchBookingDetails({ baseUrl, token, id })).unwrap();
        setBooking(result);
        const b = result as any;

        const origMemberCount = result.member_count ?? 0;
        const origGuestCount = result.guest_count ?? 0;
        const origMemberCharges = result.member_charges ?? 0;
        const origGuestCharges = result.guest_charges ?? 0;

        setMemberCount(origMemberCount);
        setNumberOfGuests(origGuestCount);
        setMemberRate(origMemberCount > 0 ? origMemberCharges / origMemberCount : 0);
        setGuestRate(origGuestCount > 0 ? origGuestCharges / origGuestCount : 0);
        setGstPercent(result.gst ?? 0);
        setSgstPercent(result.sgst ?? 0);

        // Accessory total from booking accessories
        const accs: any[] = b.facility_booking_accessories || [];
        const accTotal = accs.reduce((sum: number, item: any) => {
          const acc = item.facility_booking_accessory;
          return sum + (acc?.total ?? acc?.price * (acc?.quantity ?? 1) ?? 0);
        }, 0);
        setAccessoryTotal(accTotal);

        // Slot charges from booking
        setSlotTotal(result.slot_charges ?? 0);

        // Existing discount (absolute amount)
        setExistingDiscount(result.discount ?? 0);
      } catch {
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('facility_booking[member_count]', memberCount.toString());
      formData.append('facility_booking[guest_count]', numberOfGuests.toString());
      formData.append('facility_booking[member_charges]', memberCharges.toFixed(2));
      formData.append('facility_booking[guest_charges]', guestCharges.toFixed(2));
      formData.append('facility_booking[sub_total]', subtotalAfterDiscount.toFixed(2));
      formData.append('facility_booking[gst]', gstAmount.toFixed(2));
      formData.append('facility_booking[sgst]', sgstAmount.toFixed(2));
      formData.append('facility_booking[amount_full]', grandTotal.toFixed(2));

      await axios.patch(
        `https://${baseUrl}/api/facility_bookings/${id}.json`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Booking updated successfully!');
      navigate(-1);
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.response?.data?.message || 'Failed to update booking';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // same fieldStyles as Add page
  const fieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '0.375rem',
      backgroundColor: 'white',
      height: { xs: '36px', sm: '45px' },
      '& fieldset': { borderColor: '#d1d5db' },
      '&:hover fieldset': { borderColor: '#9ca3af' },
      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': { color: '#3b82f6' },
    },
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C72030]" />
      </div>
    );
  }

  if (!booking) {
    return <div className="p-6 text-gray-600">Booking not found</div>;
  }

  const b = booking as any;
  const scheduleSlots: string[] = b.show_schedule_arr || (b.show_schedule ? [b.show_schedule] : []);
  const accessories: any[] = b.facility_booking_accessories || [];
  const paymentMethodValue = booking.payment_method === 'NA' ? 'complementary' : booking.payment_method;
  const isComplementary = paymentMethodValue === 'complementary';
  const cancellationPolicy: string = b.cancellation_policy || '';
  const parsedDate = booking.startdate ? booking.startdate.split(' ')[0] : '';
  const slotsCount = b.selected_slots?.length ?? scheduleSlots.length;

  return (
    <>
      <div className="p-6 mx-auto">
        {/* Header — identical to Add page */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#C72030' }}
            >
              <CheckCircle className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold" style={{ color: '#C72030' }}>
              Facility Booking
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">

          {/* User Type — same layout, read-only */}
          <div>
            <RadioGroup value="occupant" className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occupant" id="edit_occupant" disabled />
                <Label htmlFor="edit_occupant">Members</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="guest" id="edit_guest" disabled />
                <Label htmlFor="edit_guest">Guest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fm" id="edit_fm" disabled />
                <Label htmlFor="edit_fm">Staff</Label>
              </div>
            </RadioGroup>
          </div>

          {/* User / Facility / Date — same 4-col grid, read-only */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <TextField
                label="User"
                value={booking.booked_by_name || ''}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
                sx={fieldStyles}
              />
            </div>
            <div className="space-y-2">
              <TextField
                label="Facility"
                value={booking.facility_name || ''}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
                sx={fieldStyles}
              />
            </div>
            <div className="space-y-2">
              <TextField
                type="date"
                label="Date"
                value={parsedDate}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
                sx={fieldStyles}
              />
            </div>
          </div>

          {/* Comment — same multiline style, read-only */}
          <div className="space-y-2">
            <TextField
              label="Comment"
              value={booking.comment || ''}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              sx={{
                mt: 1,
                '& .MuiOutlinedInput-root': {
                  height: 'auto !important',
                  padding: '2px !important',
                  display: 'flex',
                },
                '& .MuiInputBase-input': { resize: 'none !important' },
              }}
            />
          </div>

          {/* Select Slot — same checkbox grid, pre-selected disabled */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Select Slot</h2>
            {scheduleSlots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {scheduleSlots.map((slotLabel, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50 opacity-80"
                  >
                    <input
                      type="checkbox"
                      id={`edit_slot_${idx}`}
                      checked
                      disabled
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label
                      htmlFor={`edit_slot_${idx}`}
                      className="cursor-default text-sm font-medium"
                    >
                      {slotLabel}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No slot selected</p>
            )}
          </div>

          {/* Select Accessories — same card grid, pre-selected disabled */}
          {accessories.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Accessories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accessories.map((item: any, index: number) => {
                  const acc = item.facility_booking_accessory;
                  return (
                    <div
                      key={index}
                      className="flex flex-col space-y-2 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`edit_acc_${index}`}
                          checked
                          disabled
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <Label
                          htmlFor={`edit_acc_${index}`}
                          className="cursor-default text-sm font-medium flex-1"
                        >
                          {acc?.name || 'Accessory'}
                        </Label>
                        {acc?.price > 0 && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            ₹{Number(acc.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                      {acc?.quantity && (
                        <div className="flex items-center gap-2 ml-6">
                          <Label className="text-xs text-gray-600">Quantity:</Label>
                          <input
                            type="number"
                            value={acc.quantity}
                            disabled
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                          />
                          {acc?.price > 0 && (
                            <span className="text-xs text-gray-600 ml-auto">
                              Total: ₹{Number(acc.total ?? acc.price * acc.quantity).toFixed(2)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Payment Method — same RadioGroup, pre-selected disabled */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Payment Method
            </h2>
            <RadioGroup value={paymentMethodValue} className="space-y-3">
              {paymentMethodValue === 'postpaid' && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="postpaid" id="edit_postpaid" disabled />
                  <Label htmlFor="edit_postpaid">Postpaid</Label>
                </div>
              )}
              {paymentMethodValue === 'prepaid' && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prepaid" id="edit_prepaid" disabled />
                  <Label htmlFor="edit_prepaid">Prepaid</Label>
                </div>
              )}
              {paymentMethodValue === 'pay_on_facility' && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pay_on_facility" id="edit_pof" disabled />
                  <Label htmlFor="edit_pof">Pay on Facility</Label>
                </div>
              )}
              {paymentMethodValue === 'complementary' && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="complementary" id="edit_comp" disabled />
                  <Label htmlFor="edit_comp">Complementary</Label>
                </div>
              )}
            </RadioGroup>
          </div>

          {/* Charge Details Table — derived rates from booking */}
          {(memberRate > 0 || guestRate > 0) && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Charge Details</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#E5E0D3]">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Sr No.</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">User Type</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberRate > 0 && (
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">1</td>
                        <td className="border border-gray-300 px-4 py-3">Adult Member</td>
                        <td className="border border-gray-300 px-4 py-3">₹{memberRate.toFixed(2)}</td>
                      </tr>
                    )}
                    {guestRate > 0 && (
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">{memberRate > 0 ? 2 : 1}</td>
                        <td className="border border-gray-300 px-4 py-3">Adult Guest</td>
                        <td className="border border-gray-300 px-4 py-3">₹{guestRate.toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cost Summary — exact same structure as Add page */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Cost Summary</h2>
            <div className="space-y-3">

              {isComplementary ? (
                /* Complementary — same simplified view as Add page */
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="text-sm text-gray-600 italic">This is a complimentary booking</p>
                    <p className="text-lg font-bold mt-2" style={{ color: '#8B4B8C' }}>Grand Total: ₹0</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Number of Slots Selected — same blue bg row as Add page */}
                  {slotsCount > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 bg-blue-50">
                      <span className="text-gray-700 font-medium">Number of Slots Selected</span>
                      <span className="font-semibold text-blue-600">{slotsCount}</span>
                    </div>
                  )}

                  {/* Member Charge — editable count input, same inline style as guest row in Add page */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">Member Charge</span>
                        <div className="flex items-center gap-1">
                          <TextField
                            type="number"
                            size="small"
                            value={memberCount}
                            onChange={(e) => setMemberCount(Math.max(0, parseInt(e.target.value) || 0))}
                            variant="outlined"
                            sx={{
                              width: '100px',
                              '& .MuiOutlinedInput-root': {
                                height: '36px',
                                '& input': { textAlign: 'right', padding: '8px 12px' },
                              },
                            }}
                            inputProps={{ min: 0, step: 1 }}
                          />
                          <span className="text-sm text-gray-500">x ₹{memberRate.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-medium">₹{memberCharges.toFixed(2)}</span>
                  </div>

                  {/* Guest Charge — editable count input, same as Add page */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">Guest Charge</span>
                        <div className="flex items-center gap-1">
                          <TextField
                            type="number"
                            size="small"
                            value={numberOfGuests}
                            onChange={(e) => setNumberOfGuests(Math.max(0, parseInt(e.target.value) || 0))}
                            variant="outlined"
                            placeholder="No. of guests"
                            sx={{
                              width: '100px',
                              '& .MuiOutlinedInput-root': {
                                height: '36px',
                                '& input': { textAlign: 'right', padding: '8px 12px' },
                              },
                            }}
                            inputProps={{ min: 0, step: 1 }}
                          />
                          <span className="text-sm text-gray-500">x ₹{guestRate.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-medium">₹{guestCharges.toFixed(2)}</span>
                  </div>

                  {/* Slot Charges — read-only, same as Add page */}
                  {slotTotal > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">Slot Charges</span>
                        <span className="text-sm text-gray-500">
                          ({slotsCount} x ₹{slotsCount > 0 ? (slotTotal / slotsCount).toFixed(2) : '0.00'})
                        </span>
                      </div>
                      <span className="font-medium">₹{slotTotal.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Accessories Total — read-only, same as Add page */}
                  {accessories.length > 0 && accessoryTotal > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 font-medium">Accessories Total</span>
                          <div className="text-xs text-gray-500">
                            ({accessories.map((item: any) => {
                              const acc = item.facility_booking_accessory;
                              return acc ? `${acc.name} x ${acc.quantity}` : '';
                            }).filter(Boolean).join(', ')})
                          </div>
                        </div>
                      </div>
                      <span className="font-medium">₹{accessoryTotal.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Subtotal — same as Add page */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Subtotal</span>
                    <span className="font-medium">₹{subtotalBeforeDiscount.toFixed(2)}</span>
                  </div>

                  {/* Discount — read-only (not in payload), same row structure as Add page */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">Discount</span>
                    </div>
                    <span className="font-medium">₹{discountAmount.toFixed(2)}</span>
                  </div>

                  {/* Subtotal After Discount — same as Add page */}
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700 font-medium">Subtotal After Discount</span>
                      <span className="font-medium">₹{subtotalAfterDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* CGST — same as Add page */}
                  {gstPercent > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">CGST</span>
                        <span className="text-sm text-gray-500">({gstPercent}%)</span>
                      </div>
                      <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* SGST — same as Add page */}
                  {sgstPercent > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">SGST</span>
                        <span className="text-sm text-gray-500">({sgstPercent}%)</span>
                      </div>
                      <span className="font-medium">₹{sgstAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Grand Total — same purple as Add page */}
                  <div className="flex justify-between items-center py-3 bg-[#8B4B8C] bg-opacity-10 px-4 rounded-lg mt-2">
                    <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>Grand Total</span>
                    <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Submit — same purple button as Add page */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white px-8 py-2"
            >
              {isSubmitting ? 'Saving...' : 'Submit'}
            </Button>
          </div>

          {/* Footer links — same as Add page */}
          <div className="space-y-2 text-sm">
            <div
              className="flex items-center gap-2 cursor-pointer hover:underline"
              style={{ color: '#C72030' }}
              onClick={() => setOpenCancelPolicy(true)}
            >
              <FileText className="w-4 h-4" />
              Cancellation Policy
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer hover:underline"
              style={{ color: '#C72030' }}
              onClick={() => setOpenTerms(true)}
            >
              <Shield className="w-4 h-4" />
              Terms &amp; Conditions
            </div>
          </div>

          {/* Cancellation Policy Dialog — same as Add page, uses real content */}
          <Dialog open={openCancelPolicy} onClose={() => setOpenCancelPolicy(false)} maxWidth="md" fullWidth>
            <DialogTitle>Cancellation Policy</DialogTitle>
            <DialogContent>
              <div className="space-y-4">
                <div
                  className="prose prose-sm max-w-none quill-content"
                  dangerouslySetInnerHTML={{
                    __html: cancellationPolicy || "<p class='text-gray-500'>No cancellation policy provided</p>",
                  }}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenCancelPolicy(false)}
                className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Terms & Conditions Dialog — same as Add page */}
          <Dialog open={openTerms} onClose={() => setOpenTerms(false)} maxWidth="md" fullWidth>
            <DialogTitle>Terms &amp; Conditions</DialogTitle>
            <DialogContent>
              <div className="space-y-4">
                <p className="text-gray-500">No terms and conditions provided</p>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenTerms(false)}
                className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

        </form>
      </div>
    </>
  );
};

export default AmenityBookingEditPage;
