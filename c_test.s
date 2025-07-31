	.section	__TEXT,__text,regular,pure_instructions
	.build_version macos, 14, 0	sdk_version 15, 2
	.section	__TEXT,__literal4,4byte_literals
	.p2align	2, 0x0                          ## -- Begin function main
LCPI0_0:
	.long	0x3dcccccd                      ## float 0.100000001
LCPI0_1:
	.long	0x3e4ccccd                      ## float 0.200000003
LCPI0_2:
	.long	0x3e99999a                      ## float 0.300000012
	.section	__TEXT,__text,regular,pure_instructions
	.globl	_main
	.p2align	4, 0x90
_main:                                  ## @main
Lfunc_begin0:
	.cfi_startproc
	.cfi_personality 155, ___gxx_personality_v0
	.cfi_lsda 16, Lexception0
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	pushq	%r15
	pushq	%r14
	pushq	%r13
	pushq	%r12
	pushq	%rbx
	subq	$40, %rsp
	.cfi_offset %rbx, -56
	.cfi_offset %r12, -48
	.cfi_offset %r13, -40
	.cfi_offset %r14, -32
	.cfi_offset %r15, -24
	movq	__ZNSt3__14coutE@GOTPCREL(%rip), %rbx
	leaq	L_.str(%rip), %rsi
	movl	$30, %edx
	movq	%rbx, %rdi
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movq	%rax, %r14
	movq	(%rax), %rax
	movq	-24(%rax), %rsi
	addq	%r14, %rsi
	leaq	-48(%rbp), %r15
	movq	%r15, %rdi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp0:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r15, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp1:
## %bb.1:
	movq	(%rax), %rcx
Ltmp2:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp3:
## %bb.2:
	movl	%eax, %r15d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r15b, %esi
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	movq	(%rbx), %rax
	movq	-24(%rax), %rcx
	movl	$-261, %edx                     ## imm = 0xFEFB
	andl	8(%rbx,%rcx), %edx
	orl	$4, %edx
	movl	%edx, 8(%rbx,%rcx)
	movq	-24(%rax), %rax
	movq	$20, 16(%rbx,%rax)
	leaq	L_.str.1(%rip), %rsi
	movl	$4, %edx
	movq	%rbx, %rdi
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movss	LCPI0_0(%rip), %xmm0            ## xmm0 = mem[0],zero,zero,zero
	movq	%rax, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsEf
	movq	%rax, %rbx
	movq	(%rax), %rax
	movq	-24(%rax), %rsi
	addq	%rbx, %rsi
	leaq	-48(%rbp), %r14
	movq	%r14, %rdi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp8:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r14, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp9:
## %bb.3:
	movq	(%rax), %rcx
Ltmp10:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp11:
## %bb.4:
	movl	%eax, %r14d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r14b, %esi
	movq	%rbx, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%rbx, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	movq	__ZNSt3__14coutE@GOTPCREL(%rip), %rdi
	leaq	L_.str.2(%rip), %rsi
	movl	$4, %edx
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movss	LCPI0_1(%rip), %xmm0            ## xmm0 = mem[0],zero,zero,zero
	movq	%rax, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsEf
	movq	%rax, %rbx
	movq	(%rax), %rax
	movq	-24(%rax), %rsi
	addq	%rbx, %rsi
	leaq	-48(%rbp), %r14
	movq	%r14, %rdi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp16:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r14, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp17:
## %bb.5:
	movq	(%rax), %rcx
Ltmp18:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp19:
## %bb.6:
	movl	%eax, %r14d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r14b, %esi
	movq	%rbx, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%rbx, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	movq	__ZNSt3__14coutE@GOTPCREL(%rip), %rdi
	leaq	L_.str.3(%rip), %rsi
	movl	$4, %edx
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movss	LCPI0_2(%rip), %xmm0            ## xmm0 = mem[0],zero,zero,zero
	movq	%rax, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsEf
	movq	%rax, %rbx
	movq	(%rax), %rax
	movq	-24(%rax), %rsi
	addq	%rbx, %rsi
	leaq	-48(%rbp), %r14
	movq	%r14, %rdi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp24:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r14, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp25:
## %bb.7:
	movq	(%rax), %rcx
Ltmp26:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp27:
## %bb.8:
	movl	%eax, %r14d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r14b, %esi
	movq	%rbx, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%rbx, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	movq	__ZNSt3__14coutE@GOTPCREL(%rip), %rdi
	leaq	L_.str.4(%rip), %rsi
	movl	$8, %edx
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movss	LCPI0_2(%rip), %xmm0            ## xmm0 = mem[0],zero,zero,zero
	movq	%rax, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsEf
	movq	%rax, %rbx
	movq	(%rax), %rax
	movq	-24(%rax), %rsi
	addq	%rbx, %rsi
	leaq	-48(%rbp), %r14
	movq	%r14, %rdi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp32:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r14, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp33:
## %bb.9:
	movq	(%rax), %rcx
Ltmp34:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp35:
## %bb.10:
	movl	%eax, %r14d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r14b, %esi
	movq	%rbx, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%rbx, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	movq	__ZNSt3__14coutE@GOTPCREL(%rip), %r14
	leaq	L_.str.5(%rip), %rsi
	movl	$10, %edx
	movq	%r14, %rdi
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	leaq	L_.str.6(%rip), %rbx
	movl	$3, %edx
	movq	%rax, %rdi
	movq	%rbx, %rsi
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movq	%rax, %r15
	movq	(%rax), %rax
	movq	-24(%rax), %rsi
	addq	%r15, %rsi
	leaq	-48(%rbp), %r12
	movq	%r12, %rdi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp40:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r12, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp41:
## %bb.11:
	movq	(%rax), %rcx
Ltmp42:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp43:
## %bb.12:
	movl	%eax, %r12d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r12b, %esi
	movq	%r15, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%r15, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	movq	(%r14), %rax
	addq	-24(%rax), %r14
	leaq	-48(%rbp), %r15
	movq	%r15, %rdi
	movq	%r14, %rsi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp48:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r15, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp49:
## %bb.13:
	movq	(%rax), %rcx
Ltmp50:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp51:
## %bb.14:
	movl	%eax, %r14d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r14b, %esi
	movq	__ZNSt3__14coutE@GOTPCREL(%rip), %r14
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	leaq	L_.str.8(%rip), %rsi
	movl	$39, %edx
	movq	%r14, %rdi
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movq	%rax, %r14
	movq	(%rax), %rax
	movq	-24(%rax), %rsi
	addq	%r14, %rsi
	movq	%r15, %rdi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp56:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r15, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp57:
## %bb.15:
	movq	(%rax), %rcx
Ltmp58:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp59:
## %bb.16:
	movl	%eax, %r15d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r15b, %esi
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	movq	__ZNSt3__13cinE@GOTPCREL(%rip), %rdi
	leaq	-72(%rbp), %rsi
	callq	__ZNSt3__113basic_istreamIcNS_11char_traitsIcEEErsERf
	leaq	-68(%rbp), %rsi
	movq	%rax, %rdi
	callq	__ZNSt3__113basic_istreamIcNS_11char_traitsIcEEErsERf
	leaq	-64(%rbp), %rsi
	movq	%rax, %rdi
	callq	__ZNSt3__113basic_istreamIcNS_11char_traitsIcEEErsERf
	movq	__ZNSt3__14coutE@GOTPCREL(%rip), %rdi
	leaq	L_.str.9(%rip), %rsi
	movl	$8, %edx
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movss	-72(%rbp), %xmm0                ## xmm0 = mem[0],zero,zero,zero
	addss	-68(%rbp), %xmm0
	movq	%rax, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsEf
	movq	%rax, %r14
	movq	(%rax), %rax
	movq	-24(%rax), %rsi
	addq	%r14, %rsi
	leaq	-48(%rbp), %r15
	movq	%r15, %rdi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp64:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r15, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp65:
## %bb.17:
	movq	(%rax), %rcx
Ltmp66:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp67:
## %bb.18:
	movl	%eax, %r15d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r15b, %esi
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	movq	__ZNSt3__14coutE@GOTPCREL(%rip), %rdi
	leaq	L_.str.10(%rip), %rsi
	movl	$4, %edx
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movss	-64(%rbp), %xmm0                ## xmm0 = mem[0],zero,zero,zero
	movq	%rax, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsEf
	movq	%rax, %r14
	movq	(%rax), %rax
	movq	-24(%rax), %rsi
	addq	%r14, %rsi
	leaq	-48(%rbp), %r15
	movq	%r15, %rdi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp72:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r15, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp73:
## %bb.19:
	movq	(%rax), %rcx
Ltmp74:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp75:
## %bb.20:
	movl	%eax, %r15d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r15b, %esi
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	movq	__ZNSt3__14coutE@GOTPCREL(%rip), %r14
	leaq	L_.str.5(%rip), %rsi
	movl	$10, %edx
	movq	%r14, %rdi
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movss	-72(%rbp), %xmm0                ## xmm0 = mem[0],zero,zero,zero
	addss	-68(%rbp), %xmm0
	ucomiss	-64(%rbp), %xmm0
	leaq	L_.str.7(%rip), %r13
	movq	%rbx, %rsi
	cmovneq	%r13, %rsi
	cmovpq	%r13, %rsi
	movl	$3, %edx
	movq	%rax, %rdi
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movq	%rax, %r15
	movq	(%rax), %rax
	movq	-24(%rax), %rsi
	addq	%r15, %rsi
	leaq	-48(%rbp), %r12
	movq	%r12, %rdi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp80:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r12, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp81:
## %bb.21:
	movq	(%rax), %rcx
Ltmp82:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp83:
## %bb.22:
	movl	%eax, %r12d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r12b, %esi
	movq	%r15, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%r15, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	movq	(%r14), %rax
	addq	-24(%rax), %r14
	leaq	-48(%rbp), %r15
	movq	%r15, %rdi
	movq	%r14, %rsi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp88:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r15, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp89:
## %bb.23:
	movq	(%rax), %rcx
Ltmp90:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp91:
## %bb.24:
	movl	%eax, %r14d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r14b, %esi
	movq	__ZNSt3__14coutE@GOTPCREL(%rip), %r14
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	leaq	L_.str.11(%rip), %rsi
	movl	$41, %edx
	movq	%r14, %rdi
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movq	%rax, %r14
	movq	(%rax), %rax
	movq	-24(%rax), %rsi
	addq	%r14, %rsi
	movq	%r15, %rdi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp96:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r15, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp97:
## %bb.25:
	movq	(%rax), %rcx
Ltmp98:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp99:
## %bb.26:
	movl	%eax, %r15d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r15b, %esi
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	movl	$1036831949, -60(%rbp)          ## imm = 0x3DCCCCCD
	movl	$1045220557, -56(%rbp)          ## imm = 0x3E4CCCCD
	movl	$1050253722, -52(%rbp)          ## imm = 0x3E99999A
	movq	__ZNSt3__14coutE@GOTPCREL(%rip), %rdi
	leaq	L_.str.12(%rip), %rsi
	movl	$10, %edx
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movss	-60(%rbp), %xmm0                ## xmm0 = mem[0],zero,zero,zero
	addss	-56(%rbp), %xmm0
	movq	%rax, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsEf
	movq	%rax, %r14
	movq	(%rax), %rax
	movq	-24(%rax), %rsi
	addq	%r14, %rsi
	leaq	-48(%rbp), %r15
	movq	%r15, %rdi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp104:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r15, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp105:
## %bb.27:
	movq	(%rax), %rcx
Ltmp106:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp107:
## %bb.28:
	movl	%eax, %r15d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r15b, %esi
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	movq	__ZNSt3__14coutE@GOTPCREL(%rip), %rdi
	leaq	L_.str.13(%rip), %rsi
	movl	$5, %edx
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movss	-52(%rbp), %xmm0                ## xmm0 = mem[0],zero,zero,zero
	movq	%rax, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsEf
	movq	%rax, %r14
	movq	(%rax), %rax
	movq	-24(%rax), %rsi
	addq	%r14, %rsi
	leaq	-48(%rbp), %r15
	movq	%r15, %rdi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp112:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r15, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp113:
## %bb.29:
	movq	(%rax), %rcx
Ltmp114:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp115:
## %bb.30:
	movl	%eax, %r15d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r15b, %esi
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%r14, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	movq	__ZNSt3__14coutE@GOTPCREL(%rip), %rdi
	leaq	L_.str.5(%rip), %rsi
	movl	$10, %edx
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movss	-60(%rbp), %xmm0                ## xmm0 = mem[0],zero,zero,zero
	addss	-56(%rbp), %xmm0
	ucomiss	-52(%rbp), %xmm0
	cmovneq	%r13, %rbx
	cmovpq	%r13, %rbx
	movl	$3, %edx
	movq	%rax, %rdi
	movq	%rbx, %rsi
	callq	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	movq	%rax, %rbx
	movq	(%rax), %rax
	movq	-24(%rax), %rsi
	addq	%rbx, %rsi
	leaq	-48(%rbp), %r14
	movq	%r14, %rdi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp120:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	movq	%r14, %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp121:
## %bb.31:
	movq	(%rax), %rcx
Ltmp122:
	movq	%rax, %rdi
	movl	$10, %esi
	callq	*56(%rcx)
Ltmp123:
## %bb.32:
	movl	%eax, %r14d
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
	movsbl	%r14b, %esi
	movq	%rbx, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc
	movq	%rbx, %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv
	xorl	%eax, %eax
	addq	$40, %rsp
	popq	%rbx
	popq	%r12
	popq	%r13
	popq	%r14
	popq	%r15
	popq	%rbp
	retq
LBB0_64:
Ltmp124:
	movq	%rax, %rbx
Ltmp125:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp126:
	jmp	LBB0_34
LBB0_65:
Ltmp127:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_62:
Ltmp116:
	movq	%rax, %rbx
Ltmp117:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp118:
	jmp	LBB0_34
LBB0_63:
Ltmp119:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_60:
Ltmp108:
	movq	%rax, %rbx
Ltmp109:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp110:
	jmp	LBB0_34
LBB0_61:
Ltmp111:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_58:
Ltmp100:
	movq	%rax, %rbx
Ltmp101:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp102:
	jmp	LBB0_34
LBB0_59:
Ltmp103:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_56:
Ltmp92:
	movq	%rax, %rbx
Ltmp93:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp94:
	jmp	LBB0_34
LBB0_57:
Ltmp95:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_54:
Ltmp84:
	movq	%rax, %rbx
Ltmp85:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp86:
	jmp	LBB0_34
LBB0_55:
Ltmp87:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_52:
Ltmp76:
	movq	%rax, %rbx
Ltmp77:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp78:
	jmp	LBB0_34
LBB0_53:
Ltmp79:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_50:
Ltmp68:
	movq	%rax, %rbx
Ltmp69:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp70:
	jmp	LBB0_34
LBB0_51:
Ltmp71:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_48:
Ltmp60:
	movq	%rax, %rbx
Ltmp61:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp62:
	jmp	LBB0_34
LBB0_49:
Ltmp63:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_46:
Ltmp52:
	movq	%rax, %rbx
Ltmp53:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp54:
	jmp	LBB0_34
LBB0_47:
Ltmp55:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_44:
Ltmp44:
	movq	%rax, %rbx
Ltmp45:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp46:
	jmp	LBB0_34
LBB0_45:
Ltmp47:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_42:
Ltmp36:
	movq	%rax, %rbx
Ltmp37:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp38:
	jmp	LBB0_34
LBB0_43:
Ltmp39:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_40:
Ltmp28:
	movq	%rax, %rbx
Ltmp29:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp30:
	jmp	LBB0_34
LBB0_41:
Ltmp31:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_38:
Ltmp20:
	movq	%rax, %rbx
Ltmp21:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp22:
	jmp	LBB0_34
LBB0_39:
Ltmp23:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_36:
Ltmp12:
	movq	%rax, %rbx
Ltmp13:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp14:
	jmp	LBB0_34
LBB0_37:
Ltmp15:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB0_33:
Ltmp4:
	movq	%rax, %rbx
Ltmp5:
	leaq	-48(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp6:
LBB0_34:
	movq	%rbx, %rdi
	callq	__Unwind_Resume
LBB0_35:
Ltmp7:
	movq	%rax, %rdi
	callq	___clang_call_terminate
Lfunc_end0:
	.cfi_endproc
	.section	__TEXT,__gcc_except_tab
	.p2align	2, 0x0
GCC_except_table0:
Lexception0:
	.byte	255                             ## @LPStart Encoding = omit
	.byte	155                             ## @TType Encoding = indirect pcrel sdata4
	.uleb128 Lttbase0-Lttbaseref0
Lttbaseref0:
	.byte	1                               ## Call site Encoding = uleb128
	.uleb128 Lcst_end0-Lcst_begin0
Lcst_begin0:
	.uleb128 Lfunc_begin0-Lfunc_begin0      ## >> Call Site 1 <<
	.uleb128 Ltmp0-Lfunc_begin0             ##   Call between Lfunc_begin0 and Ltmp0
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp0-Lfunc_begin0             ## >> Call Site 2 <<
	.uleb128 Ltmp3-Ltmp0                    ##   Call between Ltmp0 and Ltmp3
	.uleb128 Ltmp4-Lfunc_begin0             ##     jumps to Ltmp4
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp3-Lfunc_begin0             ## >> Call Site 3 <<
	.uleb128 Ltmp8-Ltmp3                    ##   Call between Ltmp3 and Ltmp8
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp8-Lfunc_begin0             ## >> Call Site 4 <<
	.uleb128 Ltmp11-Ltmp8                   ##   Call between Ltmp8 and Ltmp11
	.uleb128 Ltmp12-Lfunc_begin0            ##     jumps to Ltmp12
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp11-Lfunc_begin0            ## >> Call Site 5 <<
	.uleb128 Ltmp16-Ltmp11                  ##   Call between Ltmp11 and Ltmp16
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp16-Lfunc_begin0            ## >> Call Site 6 <<
	.uleb128 Ltmp19-Ltmp16                  ##   Call between Ltmp16 and Ltmp19
	.uleb128 Ltmp20-Lfunc_begin0            ##     jumps to Ltmp20
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp19-Lfunc_begin0            ## >> Call Site 7 <<
	.uleb128 Ltmp24-Ltmp19                  ##   Call between Ltmp19 and Ltmp24
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp24-Lfunc_begin0            ## >> Call Site 8 <<
	.uleb128 Ltmp27-Ltmp24                  ##   Call between Ltmp24 and Ltmp27
	.uleb128 Ltmp28-Lfunc_begin0            ##     jumps to Ltmp28
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp27-Lfunc_begin0            ## >> Call Site 9 <<
	.uleb128 Ltmp32-Ltmp27                  ##   Call between Ltmp27 and Ltmp32
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp32-Lfunc_begin0            ## >> Call Site 10 <<
	.uleb128 Ltmp35-Ltmp32                  ##   Call between Ltmp32 and Ltmp35
	.uleb128 Ltmp36-Lfunc_begin0            ##     jumps to Ltmp36
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp35-Lfunc_begin0            ## >> Call Site 11 <<
	.uleb128 Ltmp40-Ltmp35                  ##   Call between Ltmp35 and Ltmp40
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp40-Lfunc_begin0            ## >> Call Site 12 <<
	.uleb128 Ltmp43-Ltmp40                  ##   Call between Ltmp40 and Ltmp43
	.uleb128 Ltmp44-Lfunc_begin0            ##     jumps to Ltmp44
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp43-Lfunc_begin0            ## >> Call Site 13 <<
	.uleb128 Ltmp48-Ltmp43                  ##   Call between Ltmp43 and Ltmp48
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp48-Lfunc_begin0            ## >> Call Site 14 <<
	.uleb128 Ltmp51-Ltmp48                  ##   Call between Ltmp48 and Ltmp51
	.uleb128 Ltmp52-Lfunc_begin0            ##     jumps to Ltmp52
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp51-Lfunc_begin0            ## >> Call Site 15 <<
	.uleb128 Ltmp56-Ltmp51                  ##   Call between Ltmp51 and Ltmp56
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp56-Lfunc_begin0            ## >> Call Site 16 <<
	.uleb128 Ltmp59-Ltmp56                  ##   Call between Ltmp56 and Ltmp59
	.uleb128 Ltmp60-Lfunc_begin0            ##     jumps to Ltmp60
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp59-Lfunc_begin0            ## >> Call Site 17 <<
	.uleb128 Ltmp64-Ltmp59                  ##   Call between Ltmp59 and Ltmp64
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp64-Lfunc_begin0            ## >> Call Site 18 <<
	.uleb128 Ltmp67-Ltmp64                  ##   Call between Ltmp64 and Ltmp67
	.uleb128 Ltmp68-Lfunc_begin0            ##     jumps to Ltmp68
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp67-Lfunc_begin0            ## >> Call Site 19 <<
	.uleb128 Ltmp72-Ltmp67                  ##   Call between Ltmp67 and Ltmp72
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp72-Lfunc_begin0            ## >> Call Site 20 <<
	.uleb128 Ltmp75-Ltmp72                  ##   Call between Ltmp72 and Ltmp75
	.uleb128 Ltmp76-Lfunc_begin0            ##     jumps to Ltmp76
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp75-Lfunc_begin0            ## >> Call Site 21 <<
	.uleb128 Ltmp80-Ltmp75                  ##   Call between Ltmp75 and Ltmp80
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp80-Lfunc_begin0            ## >> Call Site 22 <<
	.uleb128 Ltmp83-Ltmp80                  ##   Call between Ltmp80 and Ltmp83
	.uleb128 Ltmp84-Lfunc_begin0            ##     jumps to Ltmp84
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp83-Lfunc_begin0            ## >> Call Site 23 <<
	.uleb128 Ltmp88-Ltmp83                  ##   Call between Ltmp83 and Ltmp88
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp88-Lfunc_begin0            ## >> Call Site 24 <<
	.uleb128 Ltmp91-Ltmp88                  ##   Call between Ltmp88 and Ltmp91
	.uleb128 Ltmp92-Lfunc_begin0            ##     jumps to Ltmp92
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp91-Lfunc_begin0            ## >> Call Site 25 <<
	.uleb128 Ltmp96-Ltmp91                  ##   Call between Ltmp91 and Ltmp96
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp96-Lfunc_begin0            ## >> Call Site 26 <<
	.uleb128 Ltmp99-Ltmp96                  ##   Call between Ltmp96 and Ltmp99
	.uleb128 Ltmp100-Lfunc_begin0           ##     jumps to Ltmp100
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp99-Lfunc_begin0            ## >> Call Site 27 <<
	.uleb128 Ltmp104-Ltmp99                 ##   Call between Ltmp99 and Ltmp104
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp104-Lfunc_begin0           ## >> Call Site 28 <<
	.uleb128 Ltmp107-Ltmp104                ##   Call between Ltmp104 and Ltmp107
	.uleb128 Ltmp108-Lfunc_begin0           ##     jumps to Ltmp108
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp107-Lfunc_begin0           ## >> Call Site 29 <<
	.uleb128 Ltmp112-Ltmp107                ##   Call between Ltmp107 and Ltmp112
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp112-Lfunc_begin0           ## >> Call Site 30 <<
	.uleb128 Ltmp115-Ltmp112                ##   Call between Ltmp112 and Ltmp115
	.uleb128 Ltmp116-Lfunc_begin0           ##     jumps to Ltmp116
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp115-Lfunc_begin0           ## >> Call Site 31 <<
	.uleb128 Ltmp120-Ltmp115                ##   Call between Ltmp115 and Ltmp120
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp120-Lfunc_begin0           ## >> Call Site 32 <<
	.uleb128 Ltmp123-Ltmp120                ##   Call between Ltmp120 and Ltmp123
	.uleb128 Ltmp124-Lfunc_begin0           ##     jumps to Ltmp124
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp123-Lfunc_begin0           ## >> Call Site 33 <<
	.uleb128 Ltmp125-Ltmp123                ##   Call between Ltmp123 and Ltmp125
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp125-Lfunc_begin0           ## >> Call Site 34 <<
	.uleb128 Ltmp126-Ltmp125                ##   Call between Ltmp125 and Ltmp126
	.uleb128 Ltmp127-Lfunc_begin0           ##     jumps to Ltmp127
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp117-Lfunc_begin0           ## >> Call Site 35 <<
	.uleb128 Ltmp118-Ltmp117                ##   Call between Ltmp117 and Ltmp118
	.uleb128 Ltmp119-Lfunc_begin0           ##     jumps to Ltmp119
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp109-Lfunc_begin0           ## >> Call Site 36 <<
	.uleb128 Ltmp110-Ltmp109                ##   Call between Ltmp109 and Ltmp110
	.uleb128 Ltmp111-Lfunc_begin0           ##     jumps to Ltmp111
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp101-Lfunc_begin0           ## >> Call Site 37 <<
	.uleb128 Ltmp102-Ltmp101                ##   Call between Ltmp101 and Ltmp102
	.uleb128 Ltmp103-Lfunc_begin0           ##     jumps to Ltmp103
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp93-Lfunc_begin0            ## >> Call Site 38 <<
	.uleb128 Ltmp94-Ltmp93                  ##   Call between Ltmp93 and Ltmp94
	.uleb128 Ltmp95-Lfunc_begin0            ##     jumps to Ltmp95
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp85-Lfunc_begin0            ## >> Call Site 39 <<
	.uleb128 Ltmp86-Ltmp85                  ##   Call between Ltmp85 and Ltmp86
	.uleb128 Ltmp87-Lfunc_begin0            ##     jumps to Ltmp87
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp77-Lfunc_begin0            ## >> Call Site 40 <<
	.uleb128 Ltmp78-Ltmp77                  ##   Call between Ltmp77 and Ltmp78
	.uleb128 Ltmp79-Lfunc_begin0            ##     jumps to Ltmp79
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp69-Lfunc_begin0            ## >> Call Site 41 <<
	.uleb128 Ltmp70-Ltmp69                  ##   Call between Ltmp69 and Ltmp70
	.uleb128 Ltmp71-Lfunc_begin0            ##     jumps to Ltmp71
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp61-Lfunc_begin0            ## >> Call Site 42 <<
	.uleb128 Ltmp62-Ltmp61                  ##   Call between Ltmp61 and Ltmp62
	.uleb128 Ltmp63-Lfunc_begin0            ##     jumps to Ltmp63
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp53-Lfunc_begin0            ## >> Call Site 43 <<
	.uleb128 Ltmp54-Ltmp53                  ##   Call between Ltmp53 and Ltmp54
	.uleb128 Ltmp55-Lfunc_begin0            ##     jumps to Ltmp55
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp45-Lfunc_begin0            ## >> Call Site 44 <<
	.uleb128 Ltmp46-Ltmp45                  ##   Call between Ltmp45 and Ltmp46
	.uleb128 Ltmp47-Lfunc_begin0            ##     jumps to Ltmp47
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp37-Lfunc_begin0            ## >> Call Site 45 <<
	.uleb128 Ltmp38-Ltmp37                  ##   Call between Ltmp37 and Ltmp38
	.uleb128 Ltmp39-Lfunc_begin0            ##     jumps to Ltmp39
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp29-Lfunc_begin0            ## >> Call Site 46 <<
	.uleb128 Ltmp30-Ltmp29                  ##   Call between Ltmp29 and Ltmp30
	.uleb128 Ltmp31-Lfunc_begin0            ##     jumps to Ltmp31
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp21-Lfunc_begin0            ## >> Call Site 47 <<
	.uleb128 Ltmp22-Ltmp21                  ##   Call between Ltmp21 and Ltmp22
	.uleb128 Ltmp23-Lfunc_begin0            ##     jumps to Ltmp23
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp13-Lfunc_begin0            ## >> Call Site 48 <<
	.uleb128 Ltmp14-Ltmp13                  ##   Call between Ltmp13 and Ltmp14
	.uleb128 Ltmp15-Lfunc_begin0            ##     jumps to Ltmp15
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp5-Lfunc_begin0             ## >> Call Site 49 <<
	.uleb128 Ltmp6-Ltmp5                    ##   Call between Ltmp5 and Ltmp6
	.uleb128 Ltmp7-Lfunc_begin0             ##     jumps to Ltmp7
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp6-Lfunc_begin0             ## >> Call Site 50 <<
	.uleb128 Lfunc_end0-Ltmp6               ##   Call between Ltmp6 and Lfunc_end0
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
Lcst_end0:
	.byte	1                               ## >> Action Record 1 <<
                                        ##   Catch TypeInfo 1
	.byte	0                               ##   No further actions
	.p2align	2, 0x0
                                        ## >> Catch TypeInfos <<
	.long	0                               ## TypeInfo 1
Lttbase0:
	.p2align	2, 0x0
                                        ## -- End function
	.section	__TEXT,__text,regular,pure_instructions
	.private_extern	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m ## -- Begin function _ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	.globl	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	.weak_def_can_be_hidden	__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
	.p2align	4, 0x90
__ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m: ## @_ZNSt3__124__put_character_sequenceB8ne180100IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m
Lfunc_begin1:
	.cfi_startproc
	.cfi_personality 155, ___gxx_personality_v0
	.cfi_lsda 16, Lexception1
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	pushq	%r15
	pushq	%r14
	pushq	%r13
	pushq	%r12
	pushq	%rbx
	subq	$40, %rsp
	.cfi_offset %rbx, -56
	.cfi_offset %r12, -48
	.cfi_offset %r13, -40
	.cfi_offset %r14, -32
	.cfi_offset %r15, -24
	movq	%rdx, %r14
	movq	%rsi, %r15
	movq	%rdi, %rbx
Ltmp128:
	leaq	-80(%rbp), %rdi
	movq	%rbx, %rsi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE6sentryC1ERS3_
Ltmp129:
## %bb.1:
	cmpb	$0, -80(%rbp)
	je	LBB1_11
## %bb.2:
	movq	(%rbx), %rax
	movq	-24(%rax), %rax
	leaq	(%rbx,%rax), %r12
	movq	40(%rbx,%rax), %rdi
	movl	8(%rbx,%rax), %r13d
	movl	144(%rbx,%rax), %eax
	cmpl	$-1, %eax
	jne	LBB1_8
## %bb.3:
Ltmp130:
	movq	%rdi, -64(%rbp)                 ## 8-byte Spill
	leaq	-56(%rbp), %rdi
	movq	%r12, %rsi
	callq	__ZNKSt3__18ios_base6getlocEv
Ltmp131:
## %bb.4:
Ltmp132:
	movq	__ZNSt3__15ctypeIcE2idE@GOTPCREL(%rip), %rsi
	leaq	-56(%rbp), %rdi
	callq	__ZNKSt3__16locale9use_facetERNS0_2idE
Ltmp133:
## %bb.5:
	movq	(%rax), %rcx
Ltmp134:
	movq	%rax, %rdi
	movl	$32, %esi
	callq	*56(%rcx)
	movb	%al, -41(%rbp)                  ## 1-byte Spill
Ltmp135:
## %bb.6:
Ltmp140:
	leaq	-56(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp141:
## %bb.7:
	movsbl	-41(%rbp), %eax                 ## 1-byte Folded Reload
	movl	%eax, 144(%r12)
	movq	-64(%rbp), %rdi                 ## 8-byte Reload
LBB1_8:
	andl	$176, %r13d
	addq	%r15, %r14
	cmpl	$32, %r13d
	movq	%r15, %rdx
	cmoveq	%r14, %rdx
Ltmp142:
	movsbl	%al, %r9d
	movq	%r15, %rsi
	movq	%r14, %rcx
	movq	%r12, %r8
	callq	__ZNSt3__116__pad_and_outputB8ne180100IcNS_11char_traitsIcEEEENS_19ostreambuf_iteratorIT_T0_EES6_PKS4_S8_S8_RNS_8ios_baseES4_
Ltmp143:
## %bb.9:
	testq	%rax, %rax
	jne	LBB1_11
## %bb.10:
	movq	(%rbx), %rax
	movq	-24(%rax), %rax
	leaq	(%rbx,%rax), %rdi
	movl	32(%rbx,%rax), %esi
	orl	$5, %esi
Ltmp145:
	callq	__ZNSt3__18ios_base5clearEj
Ltmp146:
LBB1_11:
Ltmp150:
	leaq	-80(%rbp), %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE6sentryD1Ev
Ltmp151:
LBB1_21:
	movq	%rbx, %rax
	addq	$40, %rsp
	popq	%rbx
	popq	%r12
	popq	%r13
	popq	%r14
	popq	%r15
	popq	%rbp
	retq
LBB1_16:
Ltmp147:
	jmp	LBB1_17
LBB1_12:
Ltmp136:
	movq	%rax, %r14
Ltmp137:
	leaq	-56(%rbp), %rdi
	callq	__ZNSt3__16localeD1Ev
Ltmp138:
	jmp	LBB1_18
LBB1_13:
Ltmp139:
	movq	%rax, %rdi
	callq	___clang_call_terminate
LBB1_15:
Ltmp144:
LBB1_17:
	movq	%rax, %r14
LBB1_18:
Ltmp148:
	leaq	-80(%rbp), %rdi
	callq	__ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE6sentryD1Ev
Ltmp149:
	jmp	LBB1_19
LBB1_14:
Ltmp152:
	movq	%rax, %r14
LBB1_19:
	movq	%r14, %rdi
	callq	___cxa_begin_catch
	movq	(%rbx), %rax
	movq	-24(%rax), %rdi
	addq	%rbx, %rdi
Ltmp153:
	callq	__ZNSt3__18ios_base33__set_badbit_and_consider_rethrowEv
Ltmp154:
## %bb.20:
	callq	___cxa_end_catch
	jmp	LBB1_21
LBB1_22:
Ltmp155:
	movq	%rax, %rbx
Ltmp156:
	callq	___cxa_end_catch
Ltmp157:
## %bb.23:
	movq	%rbx, %rdi
	callq	__Unwind_Resume
LBB1_24:
Ltmp158:
	movq	%rax, %rdi
	callq	___clang_call_terminate
Lfunc_end1:
	.cfi_endproc
	.section	__TEXT,__gcc_except_tab
	.p2align	2, 0x0
GCC_except_table1:
Lexception1:
	.byte	255                             ## @LPStart Encoding = omit
	.byte	155                             ## @TType Encoding = indirect pcrel sdata4
	.uleb128 Lttbase1-Lttbaseref1
Lttbaseref1:
	.byte	1                               ## Call site Encoding = uleb128
	.uleb128 Lcst_end1-Lcst_begin1
Lcst_begin1:
	.uleb128 Ltmp128-Lfunc_begin1           ## >> Call Site 1 <<
	.uleb128 Ltmp129-Ltmp128                ##   Call between Ltmp128 and Ltmp129
	.uleb128 Ltmp152-Lfunc_begin1           ##     jumps to Ltmp152
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp130-Lfunc_begin1           ## >> Call Site 2 <<
	.uleb128 Ltmp131-Ltmp130                ##   Call between Ltmp130 and Ltmp131
	.uleb128 Ltmp144-Lfunc_begin1           ##     jumps to Ltmp144
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp132-Lfunc_begin1           ## >> Call Site 3 <<
	.uleb128 Ltmp135-Ltmp132                ##   Call between Ltmp132 and Ltmp135
	.uleb128 Ltmp136-Lfunc_begin1           ##     jumps to Ltmp136
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp140-Lfunc_begin1           ## >> Call Site 4 <<
	.uleb128 Ltmp143-Ltmp140                ##   Call between Ltmp140 and Ltmp143
	.uleb128 Ltmp144-Lfunc_begin1           ##     jumps to Ltmp144
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp145-Lfunc_begin1           ## >> Call Site 5 <<
	.uleb128 Ltmp146-Ltmp145                ##   Call between Ltmp145 and Ltmp146
	.uleb128 Ltmp147-Lfunc_begin1           ##     jumps to Ltmp147
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp150-Lfunc_begin1           ## >> Call Site 6 <<
	.uleb128 Ltmp151-Ltmp150                ##   Call between Ltmp150 and Ltmp151
	.uleb128 Ltmp152-Lfunc_begin1           ##     jumps to Ltmp152
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp137-Lfunc_begin1           ## >> Call Site 7 <<
	.uleb128 Ltmp138-Ltmp137                ##   Call between Ltmp137 and Ltmp138
	.uleb128 Ltmp139-Lfunc_begin1           ##     jumps to Ltmp139
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp148-Lfunc_begin1           ## >> Call Site 8 <<
	.uleb128 Ltmp149-Ltmp148                ##   Call between Ltmp148 and Ltmp149
	.uleb128 Ltmp158-Lfunc_begin1           ##     jumps to Ltmp158
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp149-Lfunc_begin1           ## >> Call Site 9 <<
	.uleb128 Ltmp153-Ltmp149                ##   Call between Ltmp149 and Ltmp153
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp153-Lfunc_begin1           ## >> Call Site 10 <<
	.uleb128 Ltmp154-Ltmp153                ##   Call between Ltmp153 and Ltmp154
	.uleb128 Ltmp155-Lfunc_begin1           ##     jumps to Ltmp155
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp154-Lfunc_begin1           ## >> Call Site 11 <<
	.uleb128 Ltmp156-Ltmp154                ##   Call between Ltmp154 and Ltmp156
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp156-Lfunc_begin1           ## >> Call Site 12 <<
	.uleb128 Ltmp157-Ltmp156                ##   Call between Ltmp156 and Ltmp157
	.uleb128 Ltmp158-Lfunc_begin1           ##     jumps to Ltmp158
	.byte	1                               ##   On action: 1
	.uleb128 Ltmp157-Lfunc_begin1           ## >> Call Site 13 <<
	.uleb128 Lfunc_end1-Ltmp157             ##   Call between Ltmp157 and Lfunc_end1
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
Lcst_end1:
	.byte	1                               ## >> Action Record 1 <<
                                        ##   Catch TypeInfo 1
	.byte	0                               ##   No further actions
	.p2align	2, 0x0
                                        ## >> Catch TypeInfos <<
	.long	0                               ## TypeInfo 1
Lttbase1:
	.p2align	2, 0x0
                                        ## -- End function
	.section	__TEXT,__text,regular,pure_instructions
	.private_extern	__ZNSt3__116__pad_and_outputB8ne180100IcNS_11char_traitsIcEEEENS_19ostreambuf_iteratorIT_T0_EES6_PKS4_S8_S8_RNS_8ios_baseES4_ ## -- Begin function _ZNSt3__116__pad_and_outputB8ne180100IcNS_11char_traitsIcEEEENS_19ostreambuf_iteratorIT_T0_EES6_PKS4_S8_S8_RNS_8ios_baseES4_
	.globl	__ZNSt3__116__pad_and_outputB8ne180100IcNS_11char_traitsIcEEEENS_19ostreambuf_iteratorIT_T0_EES6_PKS4_S8_S8_RNS_8ios_baseES4_
	.weak_def_can_be_hidden	__ZNSt3__116__pad_and_outputB8ne180100IcNS_11char_traitsIcEEEENS_19ostreambuf_iteratorIT_T0_EES6_PKS4_S8_S8_RNS_8ios_baseES4_
	.p2align	4, 0x90
__ZNSt3__116__pad_and_outputB8ne180100IcNS_11char_traitsIcEEEENS_19ostreambuf_iteratorIT_T0_EES6_PKS4_S8_S8_RNS_8ios_baseES4_: ## @_ZNSt3__116__pad_and_outputB8ne180100IcNS_11char_traitsIcEEEENS_19ostreambuf_iteratorIT_T0_EES6_PKS4_S8_S8_RNS_8ios_baseES4_
Lfunc_begin2:
	.cfi_startproc
	.cfi_personality 155, ___gxx_personality_v0
	.cfi_lsda 16, Lexception2
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	pushq	%r15
	pushq	%r14
	pushq	%r13
	pushq	%r12
	pushq	%rbx
	subq	$56, %rsp
	.cfi_offset %rbx, -56
	.cfi_offset %r12, -48
	.cfi_offset %r13, -40
	.cfi_offset %r14, -32
	.cfi_offset %r15, -24
	testq	%rdi, %rdi
	je	LBB2_20
## %bb.1:
	movq	%r8, %r13
	movq	%rcx, %r15
	movq	%rdi, %rbx
	movl	%r9d, -68(%rbp)                 ## 4-byte Spill
	movq	%rcx, %rax
	subq	%rsi, %rax
	movq	24(%r8), %rcx
	xorl	%r12d, %r12d
	subq	%rax, %rcx
	cmovgq	%rcx, %r12
	movq	%rdx, -88(%rbp)                 ## 8-byte Spill
	movq	%rdx, %r14
	subq	%rsi, %r14
	testq	%r14, %r14
	jle	LBB2_3
## %bb.2:
	movq	(%rbx), %rax
	movq	%rbx, %rdi
	movq	%r14, %rdx
	callq	*96(%rax)
	cmpq	%r14, %rax
	jne	LBB2_20
LBB2_3:
	testq	%r12, %r12
	jle	LBB2_16
## %bb.4:
	cmpq	$23, %r12
	jae	LBB2_8
## %bb.5:
	leal	(%r12,%r12), %eax
	movb	%al, -64(%rbp)
	leaq	-63(%rbp), %r14
	jmp	LBB2_9
LBB2_8:
	movq	%r12, %rax
	andq	$-8, %rax
	addq	$8, %rax
	movq	%r13, -80(%rbp)                 ## 8-byte Spill
	movq	%r12, %r13
	orq	$7, %r13
	cmpq	$23, %r13
	cmoveq	%rax, %r13
	incq	%r13
	movq	%r13, %rdi
	callq	__Znwm
	movq	%rax, %r14
	movq	%rax, -48(%rbp)
	orq	$1, %r13
	movq	%r13, -64(%rbp)
	movq	-80(%rbp), %r13                 ## 8-byte Reload
	movq	%r12, -56(%rbp)
LBB2_9:
	movzbl	-68(%rbp), %esi                 ## 1-byte Folded Reload
	movq	%r14, %rdi
	movq	%r12, %rdx
	callq	_memset
	movb	$0, (%r14,%r12)
	testb	$1, -64(%rbp)
	je	LBB2_11
## %bb.10:
	movq	-48(%rbp), %rsi
	jmp	LBB2_12
LBB2_11:
	leaq	-63(%rbp), %rsi
LBB2_12:
	movq	(%rbx), %rax
Ltmp159:
	movq	%rbx, %rdi
	movq	%r12, %rdx
	callq	*96(%rax)
Ltmp160:
## %bb.13:
	movq	%rax, %r14
	testb	$1, -64(%rbp)
	je	LBB2_15
## %bb.14:
	movq	-48(%rbp), %rdi
	callq	__ZdlPv
LBB2_15:
	cmpq	%r12, %r14
	jne	LBB2_20
LBB2_16:
	movq	-88(%rbp), %rsi                 ## 8-byte Reload
	subq	%rsi, %r15
	testq	%r15, %r15
	jle	LBB2_18
## %bb.17:
	movq	(%rbx), %rax
	movq	%rbx, %rdi
	movq	%r15, %rdx
	callq	*96(%rax)
	cmpq	%r15, %rax
	jne	LBB2_20
LBB2_18:
	movq	$0, 24(%r13)
	jmp	LBB2_21
LBB2_20:
	xorl	%ebx, %ebx
LBB2_21:
	movq	%rbx, %rax
	addq	$56, %rsp
	popq	%rbx
	popq	%r12
	popq	%r13
	popq	%r14
	popq	%r15
	popq	%rbp
	retq
LBB2_22:
Ltmp161:
	movq	%rax, %rbx
	testb	$1, -64(%rbp)
	je	LBB2_24
## %bb.23:
	movq	-48(%rbp), %rdi
	callq	__ZdlPv
LBB2_24:
	movq	%rbx, %rdi
	callq	__Unwind_Resume
Lfunc_end2:
	.cfi_endproc
	.section	__TEXT,__gcc_except_tab
	.p2align	2, 0x0
GCC_except_table2:
Lexception2:
	.byte	255                             ## @LPStart Encoding = omit
	.byte	255                             ## @TType Encoding = omit
	.byte	1                               ## Call site Encoding = uleb128
	.uleb128 Lcst_end2-Lcst_begin2
Lcst_begin2:
	.uleb128 Lfunc_begin2-Lfunc_begin2      ## >> Call Site 1 <<
	.uleb128 Ltmp159-Lfunc_begin2           ##   Call between Lfunc_begin2 and Ltmp159
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp159-Lfunc_begin2           ## >> Call Site 2 <<
	.uleb128 Ltmp160-Ltmp159                ##   Call between Ltmp159 and Ltmp160
	.uleb128 Ltmp161-Lfunc_begin2           ##     jumps to Ltmp161
	.byte	0                               ##   On action: cleanup
	.uleb128 Ltmp160-Lfunc_begin2           ## >> Call Site 3 <<
	.uleb128 Lfunc_end2-Ltmp160             ##   Call between Ltmp160 and Lfunc_end2
	.byte	0                               ##     has no landing pad
	.byte	0                               ##   On action: cleanup
Lcst_end2:
	.p2align	2, 0x0
                                        ## -- End function
	.section	__TEXT,__text,regular,pure_instructions
	.private_extern	___clang_call_terminate ## -- Begin function __clang_call_terminate
	.globl	___clang_call_terminate
	.weak_def_can_be_hidden	___clang_call_terminate
	.p2align	4, 0x90
___clang_call_terminate:                ## @__clang_call_terminate
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	callq	___cxa_begin_catch
	callq	__ZSt9terminatev
	.cfi_endproc
                                        ## -- End function
	.section	__TEXT,__cstring,cstring_literals
L_.str:                                 ## @.str
	.asciz	"=== \345\256\236\351\252\2141\357\274\232\345\270\270\351\207\217\347\211\210\346\234\254 ==="

L_.str.1:                               ## @.str.1
	.asciz	"a = "

L_.str.2:                               ## @.str.2
	.asciz	"b = "

L_.str.3:                               ## @.str.3
	.asciz	"c = "

L_.str.4:                               ## @.str.4
	.asciz	"a + b = "

L_.str.5:                               ## @.str.5
	.asciz	"\347\233\270\347\255\211\357\274\237 "

L_.str.6:                               ## @.str.6
	.asciz	"\346\230\257"

L_.str.7:                               ## @.str.7
	.asciz	"\345\220\246"

L_.str.8:                               ## @.str.8
	.asciz	"=== \345\256\236\351\252\2142\357\274\232\350\277\220\350\241\214\346\227\266\350\256\241\347\256\227\347\211\210\346\234\254 ==="

L_.str.9:                               ## @.str.9
	.asciz	"x + y = "

L_.str.10:                              ## @.str.10
	.asciz	"z = "

L_.str.11:                              ## @.str.11
	.asciz	"=== \345\256\236\351\252\2143\357\274\232volatile\345\205\263\351\224\256\345\255\227\347\211\210\346\234\254 ==="

L_.str.12:                              ## @.str.12
	.asciz	"va + vb = "

L_.str.13:                              ## @.str.13
	.asciz	"vc = "

.subsections_via_symbols
