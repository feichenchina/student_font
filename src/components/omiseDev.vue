<template>
  <div>
    <el-form ref="checkoutForm" :model="formData" label-width="120px">
      <el-button
        :disabled="product.status == 2"
        type="primary"
        @click="submitForm"
        >支付</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        omiseToken: "",
        omiseSource: "",
        amount: this.product.bill.course.cost,
        currency: "JPY",
      },
    };
  },
  methods: {
    submitForm() {
      const form = this.$refs.checkoutForm.$el;
      const id = this.product.id;
      OmiseCard.open({
        amount: this.product.bill.course.cost,
        currency: this.formData.currency,
        defaultPaymentMethod: "credit_card",
        onCreateTokenSuccess: (nonce) => {
          if (nonce.startsWith("tokn_")) {
            this.formData.omiseToken = nonce;
            this.$emit(
              "tokenReceived",
              nonce,
              this.formData.amount,
              this.formData.currency,
              id
            );
          } else {
            this.formData.omiseSource = nonce;
            this.$emit(
              "tokenReceived",
              false,
              this.formData.amount,
              this.formData.currency,
              id
            );
          }
          //   form.submit();
          // 在获取到 token 后执行其他逻辑，比如手动提交表单
          // this.submitFormData();
        },
      });
    },
    submitFormData() {
      // 执行提交表单的逻辑，可以发送数据给后端或其他操作
      console.log("提交表单数据:", this.formData);
    },
  },
  mounted() {
    OmiseCard.configure({
      publicKey: "pkey_test_5z1rz7q25hx5qpycfqq",
    });
  },
};
</script>
